import _ from 'lodash';
import { postgres } from 'app/models'
import { getParameters } from './helper'
import accountingConfig from 'config/accounting';
import sequelize, { Model, DataTypes, Op } from 'sequelize';

class JournalVoucher extends Model {
  static init(sequelize) {
    super.init(
      {
        id: { type: DataTypes.STRING, primaryKey: true },
        status: DataTypes.ENUM(['pending', 'confirmed', 'closed', 'error', 'canceled']),
        refDate: DataTypes.STRING,
        taxDate: DataTypes.STRING,
        dueDate: DataTypes.STRING,
        locTotal: DataTypes.DECIMAL(13, 2),
        tag: DataTypes.STRING,
        memo: DataTypes.STRING,
        ref3: DataTypes.STRING,
        pointOfSale: DataTypes.STRING,
        transId: DataTypes.STRING,
        logMessage: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: 'journalVouchers',
        hooks: {}
      }
    );
  };

  static associate(models) {
    this.belongsTo(models.accountingModelGroups, { foreignKey: 'group', as: 'groupData' });
    this.belongsTo(models.projects, { foreignKey: 'projectId', as: 'projectData' });
    this.belongsTo(models.championships, { foreignKey: 'championshipId', as: 'championshipData' });
    this.belongsTo(models.matches, { foreignKey: 'matchId', as: 'matchData' });
    this.hasMany(models.journalVoucherItems, { foreignKey: 'jeId', sourceKey: 'id', as: 'items' });
    this.hasMany(models.accountingItems, { foreignKey: 'jeId', sourceKey: 'id', as: 'acctItems' });
  };

  static async countClosed(refDate) {
    let where = { refDate, status: { [Op.ne]: 'closed' } };
    return await this.count({ where });
  };

  static async listPending({ refDate }) {
    let where = {
        status: 'pending',
        refDate: {
          [Op.gte]: accountingConfig.startDate,
          [Op.lte]: refDate
        }
      },
      include = [{
         model: postgres.JournalVoucherItems,
         as: 'items',
         include: [{
            model: postgres.ChartOfAccount,
            as: 'accountData',
            attributes: ['acctCode', 'acctName']
           },{
            model: postgres.BusinessPartner,
            as: 'businessPartner',
            attributes: ['cardCode', 'cardName']
           },{
            model: postgres.CostingCenter,
            as: 'costingCenterData',
            attributes: ['ocrCode', 'ocrName']
           },{
            model: postgres.Project,
            as: 'projectData',
            attributes: ['prjCode', 'prjName']
           }
         ]
        },{
          model: postgres.Project,
          as: 'projectData',
          attributes: ['prjCode', 'prjName']
        },{
          model: postgres.Championships,
          as: 'championshipData',
          attributes: ['id', 'name']
        },{
          model: postgres.Matches,
          as: 'matchData',
          attributes: ['id', 'name']
        }
      ],
      order = [['id', 'ASC'], ['items', 'visOrder', 'ASC']];

    return await this.findAll({where, include, order })
  };

  static async getSheetJEBase(ids) {
    let where = {
        id: { [Op.in]: _.uniq(ids) }
      },
      attributes = [],
      include = [{
       model: postgres.JournalVoucherItems,
       as: 'items',
       attributes: ['jeId', 'lineId', 'memo'],
       include: [{
          model: postgres.ChartOfAccount,
          as: 'accountData',
          attributes: ['acctCode', 'acctName']
         },{
          model: postgres.BusinessPartner,
          as: 'businessPartner',
          attributes: ['cardCode', 'cardName']
        }]
      }], result = [];

    let data = await this.findAll({where, attributes, include });

    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      result = _.concat(result, item.items);
    }

    return result
  };

  static async getReportReceitas(tags, from, to) {
    let data = [], jeIds = [],
      group = ['rct_provisao'],
      options = {
        tags, from, to, group,
        sourceDb: 'saleItems',
        extraInclude: [{
          model: postgres.SaleItems,
          as: 'saleItemRef',
          required: false,
          attributes: ['itemCode', 'itemName', 'ownerName'],
          include: [{
            model: postgres.Sales,
            as: 'saleData',
            required: false,
            attributes: ['sourceId'],
            include: [{
              model: postgres.Customer,
              as: 'customerData',
              required: false,
              attributes: ['vatNumber', 'name']
            }]
          }]
        }],
        extraOrder: ['acctItems', 'saleItemRef', 'saleData', 'sourceId', 'ASC']
      },
      { where, attributes, include, order } = getParameters(options),
      list = await this.findAll({where, attributes, include, order });

    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        lines = _.get(row, 'acctItems', );

      for (let j = 0; j < lines.length; j++) {
        let line = lines[j],
          item = {
            transId: _.get(row, 'transId', ''),
            group: _.get(row, 'groupData.name', ''),
            tag: _.get(line, 'tag', ''),
            billId: _.get(line, 'saleItemRef.saleData.sourceId', ''),
            vatNumber: _.get(line, 'saleItemRef.saleData.customerData.vatNumber', ''),
            customerName: _.get(line, 'saleItemRef.saleData.customerData.name', ''),
            refDate: _.get(row, 'refDate', ''),
            taxDate: _.get(row, 'taxDate', ''),
            dueDate: _.get(row, 'dueDate', ''),
            tag: _.get(line, 'tag', ''),
            amount: _.get(line, 'amount', 0),
            itemCode: _.get(line, 'saleItemRef.itemCode', ''),
            itemName: _.get(line, 'saleItemRef.itemName', ''),
            ownerName: _.get(line, 'saleItemRef.ownerName', ''),
            jeId: _.get(line, 'jeId', ''),
            debitLineId: _.get(line, 'debitLineId', ''),
            creditLineId: _.get(line, 'creditLineId', ''),
          };
        data.push(item);
        jeIds.push(item.jeId);
      }
    }

    const accounting = await this.getSheetJEBase(jeIds);

    return { data, accounting };
  };

  static async getReportBoletos(tags, from, to) {
    let data = [], jeIds = [],
      group = ['bnc_bol_captura', 'bnc_bol_liquidacao',  'bnc_bol_cancelamento', 'lmb_to_boleto', 'pecld_estorno'],
      options = {
        tags, from, to, group,
        sourceDb: 'slipOccurrences',
        extraInclude: [{
          model: postgres.SlipOccurrences,
          as: 'slipRef',
          required: false,
          attributes: ['type', 'occurId', 'occurName', 'paidPlace'],
          include: [{
            model: postgres.SlipTransactions,
            as: 'slipData',
            required: false,
            attributes: ['bank', 'branch', 'account', 'ourNumber', 'digitOurNumber', 'reference', 'holderName'],
            include: [{
              model: postgres.Sales,
              as: 'saleData',
              required: false,
              attributes: ['sourceId'],
              include: [{
                model: postgres.Customer,
                as: 'customerData',
                required: false,
                attributes: ['vatNumber', 'name']
              }]
            }]
          }]
        }],
        extraOrder: ['acctItems', 'slipRef', 'slipData', 'saleData', 'sourceId', 'ASC']
      },
      { where, attributes, include, order } = getParameters(options),
      list = await this.findAll({where, attributes, include, order });

    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        lines = _.get(row, 'acctItems', );

      for (let j = 0; j < lines.length; j++) {
        let line = lines[j],
          item = {
            transId: _.get(row, 'transId', ''),
            group: _.get(row, 'groupData.name', ''),
            tag: _.get(line, 'tag', ''),
            billId: _.get(line, 'slipRef.slipData.saleData.sourceId', ''),
            vatNumber: _.get(line, 'slipRef.slipData.saleData.customerData.vatNumber', ''),
            customerName: _.get(line, 'slipRef.slipData.saleData.customerData.name', ''),
            refDate: _.get(row, 'refDate', ''),
            taxDate: _.get(row, 'taxDate', ''),
            dueDate: _.get(row, 'dueDate', ''),
            tag: _.get(line, 'tag', ''),
            amount: _.get(line, 'amount', 0),
            bank: _.get(line, 'slipRef.slipData.bank', ''),
            branch: _.get(line, 'slipRef.slipData.branch', ''),
            account: _.get(line, 'slipRef.slipData.account', ''),
            ourNumber: _.get(line, 'slipRef.slipData.ourNumber', ''),
            digitOurNumber: _.get(line, 'slipRef.slipData.digitOurNumber', ''),
            reference: _.get(line, 'slipRef.slipData.reference', ''),
            holderName: _.get(line, 'slipRef.slipData.holderName', ''),
            type: _.get(line, 'slipRef.type', ''),
            occurId: _.get(line, 'slipRef.occurId', ''),
            occurName: _.get(line, 'slipRef.occurName', ''),
            paidPlace: _.get(line, 'slipRef.paidPlace', ''),
            jeId: _.get(line, 'jeId', ''),
            debitLineId: _.get(line, 'debitLineId', ''),
            creditLineId: _.get(line, 'creditLineId', ''),
          };
        data.push(item);
        jeIds.push(item.jeId);
      }
    }

    const accounting = await this.getSheetJEBase(jeIds);

    return { data, accounting };
  };

  static async getReportCartoesCaptura(tags, from, to) {
    let data = [], jeIds = [],
      group = ['adq_captura', 'lmb_to_cartao', 'pecld_estorno'],
      options = {
        tags, from, to, group,
        sourceDb: 'acquirerInstallments',
        extraInclude: [{
          model: postgres.AcquirerInstallments,
          as: 'cardRef',
          required: false,
          attributes: ['installment'],
          include: [{
            model: postgres.AcquirerTransactions,
            as: 'transData',
            required: false,
            attributes: ['acquirer', 'pointOfSale', 'batchNo', 'saleType', 'captureTime', 'nsu',
                         'authorization', 'tid', 'reference', 'cardBrandName', 'captureType'],
            include: [{
              model: postgres.Sales,
              as: 'saleData',
              required: false,
              attributes: ['sourceId'],
              include: [{
                model: postgres.Customer,
                as: 'customerData',
                required: false,
                attributes: ['vatNumber', 'name']
              }]
            }]
          }]
        }],
        extraOrder: ['acctItems', 'cardRef', 'transData', 'saleData', 'sourceId', 'ASC']
      },
      { where, attributes, include, order } = getParameters(options),
      list = await this.findAll({where, attributes, include, order });

    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        lines = _.get(row, 'acctItems', );

      for (let j = 0; j < lines.length; j++) {
        let line = lines[j],
          item = {
            transId: _.get(row, 'transId', ''),
            group: _.get(row, 'groupData.name', ''),
            tag: _.get(line, 'tag', ''),
            billId: _.get(line, 'cardRef.transData.saleData.sourceId', ''),
            vatNumber: _.get(line, 'cardRef.transData.saleData.customerData.vatNumber', ''),
            customerName: _.get(line, 'cardRef.transData.saleData.customerData.name', ''),
            refDate: _.get(row, 'refDate', ''),
            taxDate: _.get(row, 'taxDate', ''),
            dueDate: _.get(row, 'dueDate', ''),
            tag: _.get(line, 'tag', ''),
            amount: _.get(line, 'amount', 0),
            acquirer: _.get(line, 'cardRef.transData.acquirer', ''),
            pointOfSale: _.get(line, 'cardRef.transData.pointOfSale', ''),
            batchNo: _.get(line, 'cardRef.transData.batchNo', ''),
            saleType: _.get(line, 'cardRef.transData.saleType', ''),
            captureTime: _.get(line, 'cardRef.transData.captureTime', ''),
            nsu: _.get(line, 'cardRef.transData.nsu', ''),
            authorization: _.get(line, 'cardRef.transData.authorization', ''),
            tid: _.get(line, 'cardRef.transData.tid', ''),
            reference: _.get(line, 'cardRef.transData.reference', ''),
            cardBrandName: _.get(line, 'cardRef.transData.cardBrandName', ''),
            captureType: _.get(line, 'cardRef.transData.captureType', ''),
            installment: _.get(line, 'cardRef.installment', ''),
            jeId: _.get(line, 'jeId', ''),
            debitLineId: _.get(line, 'debitLineId', ''),
            creditLineId: _.get(line, 'creditLineId', ''),
          };
        data.push(item);
        jeIds.push(item.jeId);
      }
    }

    const accounting = await this.getSheetJEBase(jeIds);

    return { data, accounting };
  };

  static async getReportCartoesLiquidacao(tags, from, to) {
    let data = [], jeIds = [],
      group = ['adq_liquidacao', 'adq_antecipacao', 'adq_chargeback', 'adq_cancelamento',
               'adq_aluguel_equipamentos', 'adq_ajuste_a_debito', 'adq_ajuste_a_credito'],
      options = {
        tags, from, to, group,
        sourceDb: 'acquirerBatches',
        extraInclude: [{
          model: postgres.AcquirerBatches,
          as: 'batchRef',
          required: false,
          attributes: ['acquirer', 'pointOfSale', 'batchNo', 'operationNo', 'plan', 'cardBrandName',
                       'installment', 'bankCode', 'bankBranch', 'bankAccount', 'notes']
        }],
        extraOrder: ['acctItems', 'batchRef', 'pointOfSale', 'ASC']
      },
      { where, attributes, include, order } = getParameters(options),
      list = await this.findAll({where, attributes, include, order });

    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        lines = _.get(row, 'acctItems', );

      for (let j = 0; j < lines.length; j++) {
        let line = lines[j],
          item = {
            transId: _.get(row, 'transId', ''),
            group: _.get(row, 'groupData.name', ''),
            tag: _.get(line, 'tag', ''),
            refDate: _.get(row, 'refDate', ''),
            taxDate: _.get(row, 'taxDate', ''),
            dueDate: _.get(row, 'dueDate', ''),
            tag: _.get(line, 'tag', ''),
            amount: _.get(line, 'amount', 0),
            acquirer: _.get(line, 'batchRef.acquirer', ''),
            pointOfSale: _.get(line, 'batchRef.pointOfSale', ''),
            batchNo: _.get(line, 'batchRef.batchNo', ''),
            operationNo: _.get(line, 'batchRef.operationNo', ''),
            plan: _.get(line, 'batchRef.plan', ''),
            cardBrandName: _.get(line, 'batchRef.cardBrandName', ''),
            installment: _.get(line, 'batchRef.installment', ''),
            bankCode: _.get(line, 'batchRef.bankCode', ''),
            bankBranch: _.get(line, 'batchRef.bankBranch', ''),
            bankAccount: _.get(line, 'batchRef.bankAccount', ''),
            notes: _.get(line, 'batchRef.notes', ''),
            jeId: _.get(line, 'jeId', ''),
            debitLineId: _.get(line, 'debitLineId', ''),
            creditLineId: _.get(line, 'creditLineId', ''),
          };
        data.push(item);
        jeIds.push(item.jeId);
      }
    }

    const accounting = await this.getSheetJEBase(jeIds);

    return { data, accounting };
  };

  static async getSheetSalesBase(tags, from, to, group) {
    let data = [], jeIds = [],
      options = {
        tags, from, to, group,
        sourceDb: 'sales',
        extraInclude: [{
          model: postgres.Sales,
          as: 'saleRef',
          required: false,
          attributes: ['sourceId'],
          include: [{
            model: postgres.Customer,
            as: 'customerData',
            required: false,
            attributes: ['vatNumber', 'name']
          }]
        }],
        extraOrder: ['acctItems', 'saleRef', 'sourceId', 'ASC']
      },
      { where, attributes, include, order } = getParameters(options),
      list = await this.findAll({where, attributes, include, order });

    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        lines = _.get(row, 'acctItems', );

      for (let j = 0; j < lines.length; j++) {
        let line = lines[j],
          item = {
            transId: _.get(row, 'transId', ''),
            group: _.get(row, 'groupData.name', ''),
            tag: _.get(line, 'tag', ''),
            billId: _.get(line, 'saleRef.sourceId', ''),
            vatNumber: _.get(line, 'saleRef.customerData.vatNumber', ''),
            customerName: _.get(line, 'saleRef.customerData.name', ''),
            refDate: _.get(row, 'refDate', ''),
            taxDate: _.get(row, 'taxDate', ''),
            dueDate: _.get(row, 'dueDate', ''),
            tag: _.get(line, 'tag', ''),
            amount: _.get(line, 'amount', 0),
            jeId: _.get(line, 'jeId', ''),
            debitLineId: _.get(line, 'debitLineId', ''),
            creditLineId: _.get(line, 'creditLineId', ''),
          };
        data.push(item);
        jeIds.push(item.jeId);
      }
    }

    const accounting = await this.getSheetJEBase(jeIds);

    return { data, accounting };
  };

  static async getReportNaoCapturado(tags, from, to) {
    return this.getSheetSalesBase(tags, from, to, ['lmb_provisao', 'pecld_estorno']);
  };

  static async getReportCancelamentos(tags, from, to) {
    return this.getSheetSalesBase(tags, from, to, ['lmb_cancelamento', 'pecld_estorno']);
  };

  static async getReportPECLD(tags, from, to) {
    return this.getSheetSalesBase(tags, from, to, ['pecld_provisao']);
  };

  static async getReportCreditos(tags, from, to) {
    let data = [], jeIds = [],
      group = ['crd_captura'],
      options = {
        tags, from, to, group,
        sourceDb: 'salePayments',
        extraInclude: [{
          model: postgres.SalePayments,
          as: 'salePayRef',
          required: false,
          include: [{
            model: postgres.Sales,
            as: 'saleData',
            required: false,
            attributes: ['sourceId'],
            include: [{
              model: postgres.Customer,
              as: 'customerData',
              required: false,
              attributes: ['vatNumber', 'name']
            }]
          }]
        }],
        extraOrder: ['acctItems', 'salePayRef', 'saleData', 'sourceId', 'ASC']
      },
      { where, attributes, include, order } = getParameters(options),
      list = await this.findAll({where, attributes, include, order });

    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        lines = _.get(row, 'acctItems', );

      for (let j = 0; j < lines.length; j++) {
        let line = lines[j],
          item = {
            transId: _.get(row, 'transId', ''),
            group: _.get(row, 'groupData.name', ''),
            tag: _.get(line, 'tag', ''),
            billId: _.get(line, 'salePayRef.saleData.sourceId', ''),
            vatNumber: _.get(line, 'salePayRef.saleData.customerData.vatNumber', ''),
            customerName: _.get(line, 'salePayRef.saleData.customerData.name', ''),
            refDate: _.get(row, 'refDate', ''),
            taxDate: _.get(row, 'taxDate', ''),
            dueDate: _.get(row, 'dueDate', ''),
            tag: _.get(line, 'tag', ''),
            amount: _.get(line, 'amount', 0),
            jeId: _.get(line, 'jeId', ''),
            debitLineId: _.get(line, 'debitLineId', ''),
            creditLineId: _.get(line, 'creditLineId', ''),
          };
        data.push(item);
        jeIds.push(item.jeId);
      }
    }

    const accounting = await this.getSheetJEBase(jeIds);

    return { data, accounting };
  };

  static async getReportDuplicidade(tags, from, to) {
    let data = [], jeIds = [],
      group = ['crd_duplicidade'],
      options = {
        tags, from, to, group,
        sourceDb: 'vindiIssues',
        extraInclude: [{
          model: postgres.VindiIssues,
          as: 'vindiRef',
          required: false,
          attributes: ['customerKey'],
          include: [{
            model: postgres.Customer,
            as: 'customerData',
            required: false,
            attributes: ['vatNumber', 'name']
          },{
            model: postgres.VindiCharges,
            as: 'chargeData',
            required: false,
            attributes: ['billId']
          }]
        }],
        extraOrder: ['acctItems', 'vindiRef', 'chargeData', 'billId', 'ASC']
      },
      { where, attributes, include, order } = getParameters(options),
      list = await this.findAll({where, attributes, include, order });

    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        lines = _.get(row, 'acctItems', );

      for (let j = 0; j < lines.length; j++) {
        let line = lines[j],
          item = {
            transId: _.get(row, 'transId', ''),
            group: _.get(row, 'groupData.name', ''),
            tag: _.get(line, 'tag', ''),
            billId: _.get(line, 'vindiRef.chargeData.billId', ''),
            vatNumber: _.get(line, 'vindiRef.customerData.vatNumber', ''),
            customerName: _.get(line, 'vindiRef.customerData.name', ''),
            refDate: _.get(row, 'refDate', ''),
            taxDate: _.get(row, 'taxDate', ''),
            dueDate: _.get(row, 'dueDate', ''),
            tag: _.get(line, 'tag', ''),
            amount: _.get(line, 'amount', 0),
            jeId: _.get(line, 'jeId', ''),
            debitLineId: _.get(line, 'debitLineId', ''),
            creditLineId: _.get(line, 'creditLineId', ''),
          };
        data.push(item);
        jeIds.push(item.jeId);
      }
    }

    const accounting = await this.getSheetJEBase(jeIds);

    return { data, accounting };
  };

};

export default JournalVoucher;
