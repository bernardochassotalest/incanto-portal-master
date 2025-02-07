import _ from 'lodash';
import { postgres } from 'app/models'
import { leftString, getMoreDays } from 'app/lib/utils'
import accountingConfig from 'config/accounting';
import sequelize, { Model, DataTypes, Op, literal } from 'sequelize';

class Sales extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      sourceName: DataTypes.STRING,
      sourceDb: DataTypes.STRING,
      sourceId: DataTypes.STRING,
      refDate: DataTypes.STRING,
      taxDate: DataTypes.STRING,
      dueDate: DataTypes.STRING,
      cancelDate: DataTypes.STRING,
      amount: DataTypes.DECIMAL(13, 2),
      status: DataTypes.STRING,
      tag: DataTypes.STRING,
      startPeriod: DataTypes.STRING,
      endPeriod: DataTypes.STRING,
      isCaptured: DataTypes.ENUM(['none', 'true', 'false']),
      isPecld: DataTypes.ENUM(['none', 'true', 'false']),
      isCredit: DataTypes.ENUM(['none', 'true', 'false']),
    },
    {
      sequelize, modelName: 'sales'
    });
  }

  static associate(models) {
    this.belongsTo(models.customers, { foreignKey: 'customerId', as: 'customerData' })
    this.hasMany(models.saleItems, { foreignKey: 'saleId', sourceKey: 'id', as: 'items' });
    this.hasMany(models.saleAccountings, { foreignKey: 'saleId', sourceKey: 'id', as: 'accountings' });
    this.hasMany(models.salePayments, { foreignKey: 'saleId', sourceKey: 'id', as: 'payments' });
    this.hasMany(models.customerCredits, { foreignKey: 'sourceId', sourceKey: 'sourceId', as: 'credits' });
    this.hasOne(models.dateDimensions, { foreignKey: 'day', sourceKey: 'taxDate', as: 'dateDimensions' });
  }

  static async listAccounting({refDate}) {
    let queryCount = `
          (SELECT COUNT('a')
           FROM "accountingItems" T30
                INNER JOIN "accountConfigs" T31 ON T31."id" = T30."accountItem"
           WHERE T30."sourceDb" = 'saleItems' and T30."sourceId" = "items"."id" and
                 T31."model" = 'rct_provisao')`,
       queryMapping = `
          (SELECT MAX(T50."itemId") From "sourceMappings" T50
           WHERE T50."source" = "sales"."sourceName" and T50."id" = "items"."itemCode")`;
    let where = { refDate: refDate },
      attributes = ['sourceName', 'tag', 'refDate', 'taxDate', 'dueDate'],
      include = [{
         model: postgres.SaleItems,
         as: 'items',
         required: true,
         attributes: ['id', 'saleId', 'itemCode', 'itemName', 'quantity', 'unitPrice',
                      'discAmount', 'totalAmount', [literal(queryCount), 'count'],
                      [literal(queryMapping), 'mappingId']]
      }];

    let rows = await this.findAll({ attributes, include, where }), result = [];
    for (let i = 0; i < rows.length; i++) {
      let header = rows[i],
        items = header.items || [],
        source = _.get(header, 'sourceName', ''),
        modelH = _.pick(JSON.parse(JSON.stringify(header)), ['sourceName', 'tag', 'refDate', 'taxDate', 'dueDate', 'count']);

      for (let j = 0; j < items.length; j++) {
        let line = items[j],
          id = _.get(line, 'itemCode', ''),
          modelL = JSON.parse(JSON.stringify(line)),
          where = { source, id };

        if (_.toNumber(modelL.count) <= 0) {
          result.push({...modelH, ...modelL})
        }
      }
    }

    return result;
  }

  static async listNotCaptured({refDate}) {
    let where = {
        refDate: {
            [Op.gte]: accountingConfig.startDate,
            [Op.lte]: refDate
        }
      },
      attributes = ['id', 'sourceName', 'sourceId', 'tag', 'taxDate', 'dueDate',
                    [sequelize.fn('max', sequelize.col('accountings->acctData.refDate')), 'refDate'],
                    [sequelize.fn('sum', sequelize.col('accountings->balances.balance')), 'balance']],
      having = literal('Sum("balance") > 0'),
      include = [{
         model: postgres.SaleAccountings,
         as: 'accountings',
         required: true,
         attributes: [],
         include: [{
          model: postgres.SaleAccountingBalances,
          as: 'balances',
          required: true,
          where: { type: 'sale' },
          attributes: []
         },{
          model: postgres.AccountingItems,
          as: 'acctData',
          required: true,
          attributes: []
         }]
      }],
      group = ['sales.id', 'sales.sourceName', 'sales.sourceId', 'sales.tag', 'sales.taxDate', 'sales.dueDate'];
    return await this.findAll({ attributes, where, include, group, having, raw: true })
  }

  static async listCanceled({refDate}) {
    let where = {
        refDate: { [Op.gte]: accountingConfig.startDate },
        cancelDate: {
          [Op.gte]: accountingConfig.startDate,
          [Op.lte]: refDate
        },
        status: 'canceled'
      },
      attributes = ['id', 'sourceName', 'sourceId', 'tag', 'cancelDate', 'taxDate', 'isPecld',
                    [sequelize.fn('sum', sequelize.col('accountings->balances.balance')), 'balance']],
      having = literal('Sum("balance") > 0'),
      include = [{
         model: postgres.SaleAccountings,
         as: 'accountings',
         required: true,
         attributes: [],
         include: [{
          model: postgres.SaleAccountingBalances,
          as: 'balances',
          required: true,
          where: { type: 'notCaptured' },
          attributes: []
         }]
      }],
      group = ['sales.id', 'sales.sourceName', 'sales.sourceId', 'sales.tag',
               'sales.isPecld', 'sales.cancelDate', 'sales.taxDate'];
    return await this.findAll({ attributes, where, include, group, having, raw: true })
  }

  static getPecldInclude(type, month) {
      return [{
         model: postgres.SaleAccountings,
         as: 'accountings',
         required: true,
         attributes: [],
         include: [{
          model: postgres.SaleAccountingBalances,
          as: 'balances',
          required: true,
          where: { type },
          attributes: []
         }]
      },{
        model: postgres.DateDimensions,
        as: 'dateDimensions',
        required: true,
        attributes: [],
        where: { month }
      }]
  }

  static async listPecld({refDate}) {
    let result = [], month = leftString(refDate, 7),
      attributes = ['id', 'sourceName', 'sourceId', 'tag', 'refDate', 'taxDate', 'dueDate',
                    [sequelize.fn('sum', sequelize.col('accountings->balances.balance')), 'balance']],
      having = literal('Sum("balance") > 0'),
      slipWhere = { isCaptured: 'true', 'isPecld': 'none' },
      notCaptureWhere = { isCaptured: 'false', 'isPecld': 'none' },
      group = ['sales.id', 'sales.sourceName', 'sales.sourceId', 'sales.tag',
               'sales.refDate', 'sales.taxDate', 'sales.dueDate'],
      slipOptions = {
        attributes, where: slipWhere, group, having, raw: true,
        include: this.getPecldInclude('slip', month)
      },
      notCapturedOptions = {
        attributes, where: notCaptureWhere, group, having, raw: true,
        include: this.getPecldInclude('notCaptured', month)
      };

    result = _.concat(result, await this.findAll(slipOptions));
    result = _.concat(result, await this.findAll(notCapturedOptions));

    return result;
  }

  static async listRevertPecld({refDate}) {
    let where = {
        refDate: {
          [Op.gte]: accountingConfig.startDate,
          [Op.lte]: refDate
        },
        isPecld: 'true'
      },
      queryBalance = `(Select Sum(T20."balance")
                       From "saleAccountings" T10
                            INNER JOIN "saleAccountingBalances" T20 ON T20."saleAccountingId" = T10."id"
                       Where T10."saleId" = "sales"."id" and T20."type" = 'pecld')`,
      attributes = ['id', 'sourceName', 'sourceId', 'tag', 'taxDate', 'isPecld',
                    [literal(_.trim(queryBalance)), 'pecld'],
                    [sequelize.fn('max', sequelize.col('accountings->acctData.refDate')), 'refDate'],
                    [sequelize.fn('max', sequelize.col('accountings->acctData.dueDate')), 'dueDate'],
                    [sequelize.fn('sum', sequelize.col('accountings->balances.balance')), 'balance']],
      having = literal('Sum("balance") <= 0'),
      include = [{
         model: postgres.SaleAccountings,
         as: 'accountings',
         required: true,
         attributes: [],
         include: [{
          model: postgres.SaleAccountingBalances,
          as: 'balances',
          required: true,
          where: { type: 'slip' },
          attributes: []
         },{
          model: postgres.AccountingItems,
          as: 'acctData',
          required: true,
          attributes: []
         }]
      }],
      group = ['sales.id', 'sales.sourceName', 'sales.sourceId', 'sales.tag', 'sales.taxDate', 'sales.isPecld'];
    return await this.findAll({ attributes, where, include, group, having, raw: true })
  }

  static async listVindiCredits({refDate}) {
    let where = {
        refDate: {
          [Op.gte]: accountingConfig.startDate,
          [Op.lte]: refDate
        },
        isCredit: 'true',
        sourceName: 'vindi',
        '$credits.id$': null
      },
      include = [{
        model: postgres.CustomerCredits,
        as: 'credits',
        required: false,
        where: { sourceDb: 'sales_vindi_bills' },
        attributes: ['id']
      }],
      queryCharges = `(Select Sum(T10."amount") From "vindiCharges" T10 Where T10."billId" = "sales"."sourceId")`,
      attributes = ['id', 'sourceName', 'sourceId', 'tag', 'cancelDate', 'taxDate', 'customerId', 'amount',
                    [literal(queryCharges), 'chargeAmount']];
    return await this.findAll({ attributes, include, where, raw: true })
  }

  static async getReportHistorico(tags, from, to) {
    let data = [], jeIds = [],
      where = {
        tag: { [Op.in]: tags },
        refDate: { [Op.gte]: from, [Op.lte]: to }
      },
      attributes = ['sourceId', 'tag', 'refDate', 'taxDate', 'status'],
      include = [{
        model: postgres.Customer,
        as: 'customerData',
        required: true,
        attributes: ['vatNumber', 'name']
      },{
        model: postgres.SaleAccountings,
        as: 'accountings',
        required: true,
        attributes: ['timeLog'],
        include: [{
          model: postgres.AccountingItems,
          as: 'acctData',
          required: true,
          attributes: ['refDate', 'dueDate', 'amount', 'jeId', 'debitLineId', 'creditLineId'],
          include: [{
            model: postgres.AccountConfigs,
            as: 'accountingData',
            required: true,
            attributes: ['id'],
            include: [{
              model: postgres.AccountingModel,
              as: 'accountingModel',
              required: true,
              attributes: ['name']
            }]
          },{
            model: postgres.JournalVouchers,
            as: 'journalVoucher',
            required: true,
            attributes: ['transId'],
            include: [{
              model: postgres.AccountingModelGroups,
              as: 'groupData',
              required: true,
              attributes: ['name']
            }]
          }]
        }]
      }],
      order = [
        ['tag', 'ASC'],
        ['taxDate', 'ASC'],
        ['sourceId', 'ASC'],
        ['accountings', 'timeLog', 'ASC'],
      ],
      list = await this.findAll({where, attributes, include, order });
    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        lines = _.get(row, 'accountings', );

      for (let j = 0; j < lines.length; j++) {
        let line = lines[j],
          item = {
            tag: _.get(row, 'tag', ''),
            billId: _.get(row, 'sourceId', ''),
            taxDate: _.get(row, 'taxDate', ''),
            status: _.get(row, 'status', ''),
            vatNumber: _.get(row, 'customerData.vatNumber', ''),
            customerName: _.get(row, 'customerData.name', ''),
            model: _.get(line, 'acctData.accountingData.accountingModel.name', ''),
            transId: _.get(line, 'acctData.journalVoucher.transId', ''),
            refDate: _.get(row, 'refDate', ''),
            dueDate: _.get(line, 'acctData.dueDate', ''),
            group: _.get(line, 'acctData.journalVoucher.groupData.name', ''),
            amount: _.get(line, 'acctData.amount', 0),
            jeId: _.get(line, 'acctData.jeId', ''),
            debitLineId: _.get(line, 'acctData.debitLineId', ''),
            creditLineId: _.get(line, 'acctData.creditLineId', ''),
          };
        data.push(item);
        jeIds.push(item.jeId);
      }
    }

    const accounting = await postgres.JournalVouchers.getSheetJEBase(jeIds);

    return { data, accounting };
  };

  static async getReportSaldos(tags, from, to) {
    let data = [],
      where = {
        tag: { [Op.in]: tags },
        taxDate: { [Op.gte]: from, [Op.lte]: to }
      },
      attributes = ['sourceId', 'tag', 'taxDate', 'status'],
      include = [{
        model: postgres.Customer,
        as: 'customerData',
        required: true,
        attributes: ['vatNumber', 'name']
      },{
        model: postgres.SaleAccountings,
        as: 'accountings',
        required: true,
        attributes: ['timeLog'],
        include: [{
          model: postgres.AccountingItems,
          as: 'acctData',
          required: true,
          attributes: ['amount', 'jeId'],
          include: [{
            model: postgres.JournalVouchers,
            as: 'journalVoucher',
            required: true,
            attributes: ['transId'],
            include: [{
              model: postgres.AccountingModelGroups,
              as: 'groupData',
              required: true,
              attributes: ['id', 'name'],
              include: [{
                model: postgres.AccountingDashboards,
                as: 'dashboards',
                required: true,
                attributes: ['type', 'factor'],
                where: {
                  type: {
                    [Op.in]: ['invoiced', 'notCaptured']
                  }
                }
              }]
            }]
          }]
        }]
      }],
      order = [
        ['tag', 'ASC'],
        ['taxDate', 'ASC'],
        ['sourceId', 'ASC'],
        ['accountings', 'acctData', 'journalVoucher', 'groupData', 'dashboards', 'type', 'ASC'],
        ['accountings', 'acctData', 'journalVoucher', 'groupData', 'dashboards', 'visOrder', 'ASC'],
      ],
      list = await this.findAll({where, attributes, include, order });

    list.map(row => {
      let lines = _.get(row, 'accountings', []),
        bill = {
          tag: _.get(row, 'tag', ''),
          billId: _.get(row, 'sourceId', ''),
          taxDate: _.get(row, 'taxDate', ''),
          status: _.get(row, 'status', ''),
          vatNumber: _.get(row, 'customerData.vatNumber', ''),
          customerName: _.get(row, 'customerData.name', ''),
          invoiced_rct_provisao: 0,
          invoiced_adq_captura: 0,
          invoiced_bnc_bol_captura: 0,
          invoiced_bnc_bol_cancelamento: 0,
          invoiced_lmb_provisao: 0,
          invoiced_crd_captura: 0,
          notCaptured_lmb_provisao: 0,
          notCaptured_lmb_to_boleto: 0,
          notCaptured_lmb_to_cartao: 0,
          notCaptured_lmb_cancelamento: 0,
        };

      lines.map(line => {
        let dashboards = _.get(line, 'acctData.journalVoucher.groupData.dashboards', []),
          group = _.get(line, 'acctData.journalVoucher.groupData.id', ''),
          amount = _.get(line, 'acctData.amount', 0);

        dashboards.map(dashboard => {
          let type = _.get(dashboard, 'type', ''),
            factor = _.get(dashboard, 'factor', 0);
          bill[`${type}_${group}`] += (amount * factor);
        })
      })

      bill['invoiced_saldo'] = _.round(bill.invoiced_rct_provisao + bill.invoiced_adq_captura +
                                       bill.invoiced_bnc_bol_captura + bill.invoiced_bnc_bol_cancelamento +
                                       bill.invoiced_lmb_provisao + bill.invoiced_crd_captura, 2);
      bill['notCaptured_saldo'] = _.round(bill.notCaptured_lmb_provisao + bill.notCaptured_lmb_to_boleto +
                                          bill.notCaptured_lmb_to_cartao + bill.notCaptured_lmb_cancelamento, 2);

      data.push(bill);
    })

    return data;
  }

  static async getReportSaldosAbertos(tags, from, to, type) {
    let startDate = (from < accountingConfig.startDate ? accountingConfig.startDate : from),
      queryBalance = `
           (Select T10."saleId"
            From "saleAccountings" T10
                 INNER JOIN "saleAccountingBalances" T11 ON T11."saleAccountingId" = T10."id"
            Where T11."type" = '${type}'
            Group By T10."saleId", T11."type"
            Having Sum(T11."balance") > 0)`,
      where = {
        tag: { [Op.in]: tags },
        taxDate: { [Op.gte]: startDate, [Op.lte]: to },
        id: { [Op.in]: sequelize.literal(_.trim(queryBalance)) }
      },
      attributes = ['id', 'sourceId', 'tag', 'refDate', 'status', 'amount'],
      include = [{
        model: postgres.Customer,
        as: 'customerData',
        required: true,
        attributes: ['vatNumber', 'name']
      }],
      order = [ ['customerData', 'name', 'ASC'], ['sourceId', 'ASC'], ],
      list = this.findAll({where, attributes, include, order });

    const data = list.map((o) => {
      let item = {
        id: _.get(o, 'id', ''),
        sourceId: _.get(o, 'sourceId', ''),
        tag: _.get(o, 'tag', ''),
        refDate: _.get(o, 'refDate', ''),
        status: _.get(o, 'status', ''),
        vatNumber: _.get(o, 'customerData.vatNumber', ''),
        customerName: _.get(o, 'customerData.name', ''),
        amount: _.get(o, 'amount', ''),
      }
      return item;
    })
    return data;
  }
}

export default Sales;
