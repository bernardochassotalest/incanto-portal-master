import _ from 'lodash'
import { postgres } from 'app/models'
import accountingConfig from 'config/accounting';
import sequelize, { Model, DataTypes, Op, literal } from 'sequelize';

class ConciliationItems extends Model {
  static init(sequelize) {
      super.init({
          id: { type: DataTypes.STRING, primaryKey: true },
          date: DataTypes.STRING,
          rule: DataTypes.STRING,
          sourceName: DataTypes.STRING,
          sourceDb: DataTypes.STRING,
          sourceId: DataTypes.STRING,
          pointOfSale: DataTypes.STRING,
          keyCommon: DataTypes.STRING,
          keyTid: DataTypes.STRING,
          keyNsu: DataTypes.STRING,
          credit: DataTypes.DECIMAL(13, 2),
          debit: DataTypes.DECIMAL(13, 2),
          balance: DataTypes.DECIMAL(13, 2),
      },
      {
          sequelize, modelName: 'conciliationItems'
      });
  }

  static associate(models) {
    this.hasOne(models.conciliationKeys, { sourceKey: 'id', foreignKey: 'conciliationItemId', as: 'keys' });
    this.belongsTo(models.slipOccurrences, { sourceKey: 'id', foreignKey: 'sourceId', as: 'slipRef' });
    this.belongsTo(models.acquirerTransactions, { sourceKey: 'id', foreignKey: 'sourceId', as: 'cardRef' });
    this.belongsTo(models.acquirerBatches, { sourceKey: 'id', foreignKey: 'sourceId', as: 'batchRef' });
    this.belongsTo(models.bankStatements, { sourceKey: 'id', foreignKey: 'sourceId', as: 'bankRef' });
    this.belongsTo(models.vindiTransactions, { sourceKey: 'id', foreignKey: 'sourceId', as: 'vindiRef' });
    this.belongsTo(models.multiclubesPayments, { sourceKey: 'id', foreignKey: 'sourceId', as: 'multiRef' });
    this.hasOne(models.slipTransactions, { sourceKey: 'keyCommon', foreignKey: 'keyCommon', as: 'slipTrans' });
  }

  static async countContent(date) {
    return await this.count({ where: { date } });
  }

  static async countConcilied(date) {
    let where = {
          date: date,
          '$keys.keyId$': null
      },
      include = [{
        model: postgres.ConciliationKeys,
        as: 'keys',
        required: false,
        attributes: []
      }];
    return await this.count({ where, include });
  }

  static async listByRule(rule) {
    let queryGroup = `
          (Select T0."keyCommon"
           From "conciliationItems" T0
                LEFT JOIN "conciliationKeys" T1 ON T1."conciliationItemId" = T0."id"
           Where T0."rule" = '${rule}' and Coalesce(T1."keyId",'') = ''
           Group By T0."rule", T0."keyCommon"
           Having Sum(T0."balance") = 0)`,
        where = {
          rule: rule,
          keyCommon: { [Op.in]: sequelize.literal(queryGroup) }
        },
        attributes = ['id', 'rule', 'keyCommon'],
        order = [['keyCommon', 'ASC']];

    return await this.findAll({ attributes, where, order })
  }

  static async listKeysCommon() {
    let result = [];

    result = _.concat(result, await this.listByRule('creditcard_settlement'));
    result = _.concat(result, await this.listByRule('slip_capture'));
    result = _.concat(result, await this.listByRule('slip_canceled'));
    result = _.concat(result, await this.listByRule('slip_settlement'));
    result = _.concat(result, await this.listByRule('slip_fee'));
    result = _.concat(result, await this.listByRule('direct_debit_capture'));
    result = _.concat(result, await this.listByRule('direct_debit_settlement'));

    return result;
  }

  static async listKeysNsu() {
    let queryGroup = `
          (Select T0."keyNsu"
           From "conciliationItems" T0
                LEFT JOIN "conciliationKeys" T1 ON T1."conciliationItemId" = T0."id"
           Where T0."rule" = 'creditcard_capture' and Coalesce(T1."keyId",'') = ''
           Group By T0."rule", T0."keyNsu"
           Having Sum(T0."balance") = 0)`,
        where = {
          rule: 'creditcard_capture',
          keyNsu: { [Op.in]: sequelize.literal(queryGroup) }
        },
        attributes = ['id', 'rule', 'keyNsu'],
        order = [['keyNsu', 'ASC']];

    return await this.findAll({ attributes, where, order })
  }

  static async listCanceledKeys() {
    let attributes = ['date', 'keyCommon', 'debit', 'balance'],
      where = {
        rule: 'slip_canceled',
        debit: { [Op.gt]: 0 },
        date: { [Op.gte]: accountingConfig.startDate },
        '$slipTrans.occurrences.id$': { [Op.ne]: null },
        '$keys.conciliationItemId$': null
      },
      include = [{
        model: postgres.ConciliationKeys,
        as: 'keys',
        required: false,
        attributes: ['notes']
      }, {
        model: postgres.SlipTransactions,
        as: 'slipTrans',
        required: false,
        attributes: ['id'],
        include: [{
          model: postgres.SlipOccurrences,
          as: 'occurrences',
          required: false,
          attributes: ['id', 'date'],
          where: { 'type': 'settlement' }
        },{
          model: postgres.Banks,
          as: 'bankData',
          required: false,
          attributes: ['nick']
        }]
      }];
    return await this.findAll({ attributes, where, include });
  }

  static async getReportBoletos(tags, from, to, isManual) {
    let data = [],
      where = {
        date: { [Op.gte]: from, [Op.lte]: to },
        sourceDb: 'slipOccurrences'
      },
      attributes = ['id', 'keyCommon'],
      include = [{
        model: postgres.ConciliationKeys,
        as: 'keys',
        required: false,
        attributes: ['notes'],
        include: [{
          model: postgres.User,
          as: 'userData',
          required: false,
          attributes: ['name']
        }]
      }, {
        model: postgres.SlipOccurrences,
        as: 'slipRef',
        required: true,
        attributes: ['date', 'occurId', 'occurName'],
        include: [{
          model: postgres.SlipTransactions,
          as: 'slipData',
          required: true,
          where: { tag: { [Op.in]: tags } },
          attributes: ['bank', 'branch', 'account', 'digitAccount', 'tag', 'ourNumber', 'digitOurNumber',
                       'refDate', 'dueDate', 'amount', 'holderName']
        }]
      }],
      order = [['slipRef', 'slipData', 'ourNumber', 'ASC']];

    if (isManual == true) {
      where['$keys.isManual$'] = 'true';
      where['$keys.keyId$'] = { [Op.ne]: null };
    } else {
      where['$keys.keyId$'] = null;
    }

    const list = await this.findAll({where, attributes, include, order });
    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        item = {
          bank: _.get(row, 'slipRef.slipData.bank', ''),
          branch: _.get(row, 'slipRef.slipData.branch', ''),
          account: _.get(row, 'slipRef.slipData.account', ''),
          digitAccount: _.get(row, 'slipRef.slipData.digitAccount', ''),
          tag: _.get(row, 'slipRef.slipData.tag', ''),
          ourNumber: _.get(row, 'slipRef.slipData.ourNumber', ''),
          digitOurNumber: _.get(row, 'slipRef.slipData.digitOurNumber', ''),
          refDate: _.get(row, 'slipRef.slipData.refDate', ''),
          dueDate: _.get(row, 'slipRef.slipData.dueDate', ''),
          amount: _.get(row, 'slipRef.slipData.amount', ''),
          holderName: _.get(row, 'slipRef.slipData.holderName', ''),
          occurDate: _.get(row, 'slipRef.date', ''),
          occurId: _.get(row, 'slipRef.occurId', ''),
          occurName: _.get(row, 'slipRef.occurName', ''),
          keyNotes: _.get(row, 'keys.notes', ''),
          userName: _.get(row, 'keys.userData.name', ''),
          keyCommon: _.get(row, 'keyCommon', ''),
          concId: _.get(row, 'id', ''),
        };
      data.push(item);
    }

    return data;
  };

  static async getReportCartaoCaptura(tags, from, to, isManual) {
    let data = [],
      where = {
        date: { [Op.gte]: from, [Op.lte]: to },
        sourceDb: 'acquirerTransactions'
      },
      attributes = ['id', 'keyCommon'],
      include = [{
        model: postgres.ConciliationKeys,
        as: 'keys',
        required: false,
        attributes: ['notes'],
        include: [{
          model: postgres.User,
          as: 'userData',
          required: false,
          attributes: ['name']
        }]
      }, {
        model: postgres.AcquirerTransactions,
        as: 'cardRef',
        required: true,
        where: { tag: { [Op.in]: tags } },
        attributes: ['acquirer', 'tag', 'pointOfSale', 'batchNo', 'saleType', 'captureDate', 'captureTime',
                     'grossAmount', 'rate', 'commission', 'netAmount', 'nsu', 'authorization', 'tid', 'reference',
                     'cardNumber', 'cardBrandName', 'captureType', 'terminalNo']
      }],
      order = [
        ['cardRef', 'acquirer', 'ASC'],
        ['cardRef', 'pointOfSale', 'ASC'],
        ['cardRef', 'captureDate', 'ASC'],
        ['cardRef', 'captureTime', 'ASC'],
      ];

    if (isManual == true) {
      where['$keys.isManual$'] = 'true';
      where['$keys.keyId$'] = { [Op.ne]: null };
    } else {
      where['$keys.keyId$'] = null;
    }

    const list = await this.findAll({where, attributes, include, order });
    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        item = {
          acquirer: _.get(row, 'cardRef.acquirer', ''),
          tag: _.get(row, 'cardRef.tag', ''),
          pointOfSale: _.get(row, 'cardRef.pointOfSale', ''),
          batchNo: _.get(row, 'cardRef.batchNo', ''),
          saleType: _.get(row, 'cardRef.saleType', ''),
          captureDate: _.get(row, 'cardRef.captureDate', ''),
          captureTime: _.get(row, 'cardRef.captureTime', ''),
          grossAmount: _.get(row, 'cardRef.grossAmount', ''),
          rate: _.get(row, 'cardRef.rate', ''),
          commission: _.get(row, 'cardRef.commission', ''),
          netAmount: _.get(row, 'cardRef.netAmount', ''),
          nsu: _.get(row, 'cardRef.nsu', ''),
          authorization: _.get(row, 'cardRef.authorization', ''),
          tid: _.get(row, 'cardRef.tid', ''),
          reference: _.get(row, 'cardRef.reference', ''),
          cardNumber: _.get(row, 'cardRef.cardNumber', ''),
          cardBrandName: _.get(row, 'cardRef.cardBrandName', ''),
          captureType: _.get(row, 'cardRef.captureType', ''),
          terminalNo: _.get(row, 'cardRef.terminalNo', ''),
          keyNotes: _.get(row, 'keys.notes', ''),
          userName: _.get(row, 'keys.userData.name', ''),
          keyCommon: _.get(row, 'keyCommon', ''),
          concId: _.get(row, 'id', ''),
        };
      data.push(item);
    }

    return data;
  };

  static async getReportCartaoLiquidacao(tags, from, to, isManual) {
    let data = [],
      where = {
        date: { [Op.gte]: from, [Op.lte]: to },
        sourceDb: 'acquirerBatches'
      },
      attributes = ['id', 'keyCommon'],
      include = [{
        model: postgres.ConciliationKeys,
        as: 'keys',
        required: false,
        attributes: ['notes'],
        include: [{
          model: postgres.User,
          as: 'userData',
          required: false,
          attributes: ['name']
        }]
      }, {
        model: postgres.AcquirerBatches,
        as: 'batchRef',
        required: true,
        where: { tag: { [Op.in]: tags } },
        attributes: ['acquirer', 'tag', 'pointOfSale', 'type', 'plan', 'refDate', 'batchNo', 'operationNo',
                     'settlement', 'installment', 'cardBrandName', 'bankCode', 'bankBranch', 'bankAccount', 'notes']
      }],
      order = [
        ['batchRef', 'acquirer', 'ASC'],
        ['batchRef', 'pointOfSale', 'ASC'],
        ['batchRef', 'type', 'ASC'],
        ['batchRef', 'batchNo', 'ASC'],
      ];

    if (isManual == true) {
      where['$keys.isManual$'] = 'true';
      where['$keys.keyId$'] = { [Op.ne]: null };
    } else {
      where['$keys.keyId$'] = null;
    }

    const list = await this.findAll({where, attributes, include, order });
    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        item = {
          acquirer: _.get(row, 'batchRef.acquirer', ''),
          tag: _.get(row, 'batchRef.tag', ''),
          pointOfSale: _.get(row, 'batchRef.pointOfSale', ''),
          type: _.get(row, 'batchRef.type', ''),
          plan: _.get(row, 'batchRef.plan', ''),
          refDate: _.get(row, 'batchRef.refDate', ''),
          batchNo: _.get(row, 'batchRef.batchNo', ''),
          operationNo: _.get(row, 'batchRef.operationNo', ''),
          settlement: _.get(row, 'batchRef.settlement', ''),
          installment: _.get(row, 'batchRef.installment', ''),
          cardBrandName: _.get(row, 'batchRef.cardBrandName', ''),
          bankCode: _.get(row, 'batchRef.bankCode', ''),
          bankBranch: _.get(row, 'batchRef.bankBranch', ''),
          bankAccount: _.get(row, 'batchRef.bankAccount', ''),
          notes: _.get(row, 'batchRef.notes', ''),
          keyNotes: _.get(row, 'keys.notes', ''),
          userName: _.get(row, 'keys.userData.name', ''),
          keyCommon: _.get(row, 'keyCommon', ''),
          concId: _.get(row, 'id', ''),
        };
      data.push(item);
    }

    return data;
  };

  static async getReportExtratoBancario(tags, from, to, isManual) {
    let data = [],
      where = {
        date: { [Op.gte]: from, [Op.lte]: to },
        sourceDb: 'bankStatements'
      },
      attributes = ['id', 'keyCommon'],
      include = [{
        model: postgres.ConciliationKeys,
        as: 'keys',
        required: false,
        attributes: ['notes'],
        include: [{
          model: postgres.User,
          as: 'userData',
          required: false,
          attributes: ['name']
        }]
      }, {
        model: postgres.BankStatements,
        as: 'bankRef',
        required: true,
        attributes: ['bank', 'branch', 'account', 'digitAccount', 'conciliationType', 'date',
                     'debit', 'credit', 'acquirer', 'pointOfSale', 'cashFlow', 'notes']
      }],
      order = [
        ['bankRef', 'bank', 'ASC'],
        ['bankRef', 'branch', 'ASC'],
        ['bankRef', 'account', 'ASC'],
        ['bankRef', 'date', 'ASC'],
        ['bankRef', 'conciliationType', 'ASC'],
      ];

    if (isManual == true) {
      where['$keys.isManual$'] = 'true';
      where['$keys.keyId$'] = { [Op.ne]: null };
    } else {
      where['$keys.keyId$'] = null;
    }

    const list = await this.findAll({where, attributes, include, order });
    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        item = {
          bank: _.get(row, 'bankRef.bank', ''),
          branch: _.get(row, 'bankRef.branch', ''),
          account: _.get(row, 'bankRef.account', ''),
          digitAccount: _.get(row, 'bankRef.digitAccount', ''),
          conciliationType: _.get(row, 'bankRef.conciliationType', ''),
          date: _.get(row, 'bankRef.date', ''),
          debit: _.get(row, 'bankRef.debit', ''),
          credit: _.get(row, 'bankRef.credit', ''),
          acquirer: _.get(row, 'bankRef.acquirer', ''),
          pointOfSale: _.get(row, 'bankRef.pointOfSale', ''),
          cashFlow: _.get(row, 'bankRef.cashFlow', ''),
          notes: _.get(row, 'bankRef.notes', ''),
          keyNotes: _.get(row, 'keys.notes', ''),
          userName: _.get(row, 'keys.userData.name', ''),
          keyCommon: _.get(row, 'keyCommon', ''),
          concId: _.get(row, 'id', ''),
        };
      data.push(item);
    }

    return data;
  };

  static async getReportVindi(tags, from, to, isManual) {
    if (_.includes(tags, 'avanti') == false) {
      return [];
    }
    let data = [],
      where = {
        date: { [Op.gte]: from, [Op.lte]: to },
        sourceDb: 'vindiTransactions'
      },
      attributes = ['id', 'date', 'keyCommon'],
      include = [{
        model: postgres.ConciliationKeys,
        as: 'keys',
        required: false,
        attributes: ['notes'],
        include: [{
          model: postgres.User,
          as: 'userData',
          required: false,
          attributes: ['name']
        }]
      }, {
        model: postgres.VindiTransactions,
        as: 'vindiRef',
        required: true,
        attributes: ['id', 'amount', 'transactionType', 'status', 'paymentMethod', 'authorization', 'tid', 'nsu'],
        include: [{
          model: postgres.VindiCharges,
          as: 'chargeData',
          required: true,
          attributes: ['billId'],
          include: [{
            model: postgres.Sales,
            as: 'saleData',
            required: false,
            where: { sourceDb: 'sales_vindi_bills' },
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
      order = [['vindiRef', 'chargeData', 'billId', 'ASC']];

    if (isManual == true) {
      where['$keys.isManual$'] = 'true';
      where['$keys.keyId$'] = { [Op.ne]: null };
    } else {
      where['$keys.keyId$'] = null;
    }

    const list = await this.findAll({where, attributes, include, order });
    for (var i = 0; i < list.length; i++) {
      let row = list[i],
        item = {
          billId: _.get(row, 'vindiRef.chargeData.billId', ''),
          vatNumber: _.get(row, 'vindiRef.chargeData.saleData.customerData.vatNumber', ''),
          name: _.get(row, 'vindiRef.chargeData.saleData.customerData.name', ''),
          id: _.get(row, 'vindiRef.id', ''),
          date: _.get(row, 'date', ''),
          amount: _.get(row, 'vindiRef.amount', ''),
          transactionType: _.get(row, 'vindiRef.transactionType', ''),
          status: _.get(row, 'vindiRef.status', ''),
          paymentMethod: _.get(row, 'vindiRef.paymentMethod', ''),
          nsu: _.get(row, 'vindiRef.nsu', ''),
          authorization: _.get(row, 'vindiRef.authorization', ''),
          tid: _.get(row, 'vindiRef.tid', ''),
          keyNotes: _.get(row, 'keys.notes', ''),
          userName: _.get(row, 'keys.userData.name', ''),
          keyCommon: _.get(row, 'keyCommon', ''),
          concId: _.get(row, 'id', ''),
        };
      data.push(item);
    }

    return data;
  };

  static async getReportMulticlubes(tags, from, to, isManual) {
    if (_.includes(tags, 'multiclubes') == false) {
      return [];
    }
    let data = [],
      where = {
        date: { [Op.gte]: from, [Op.lte]: to },
        sourceDb: 'multiclubesPayments'
      },
      attributes = ['id', 'keyCommon'],
      include = [{
        model: postgres.ConciliationKeys,
        as: 'keys',
        required: false,
        attributes: ['notes'],
        include: [{
          model: postgres.User,
          as: 'userData',
          required: false,
          attributes: ['name']
        }]
      }, {
        model: postgres.MulticlubesPayments,
        as: 'multiRef',
        required: true,
        attributes: ['paymentId', 'titleNumber', 'memberVatNumber', 'memberName', 'mode', 'paidDate',
                     'paidAmount', 'tefDate', 'tefTime', 'tefNsu', 'tefAuthNumber', 'tefTid',
                     'tefCardNumber', 'tefParcelType']
      }],
      order = [
        ['multiRef', 'memberName', 'ASC'],
        ['multiRef', 'tefDate', 'ASC'],
        ['multiRef', 'tefTime', 'ASC'],
      ];

    if (isManual == true) {
      where['$keys.isManual$'] = 'true';
      where['$keys.keyId$'] = { [Op.ne]: null };
    } else {
      where['$keys.keyId$'] = null;
    }

    const list = await this.findAll({where, attributes, include, order });
    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        item = {
          paymentId: _.get(row, 'multiRef.paymentId', ''),
          titleNumber: _.get(row, 'multiRef.titleNumber', ''),
          memberVatNumber: _.get(row, 'multiRef.memberVatNumber', ''),
          memberName: _.get(row, 'multiRef.memberName', ''),
          mode: _.get(row, 'multiRef.mode', ''),
          paidDate: _.get(row, 'multiRef.paidDate', ''),
          paidAmount: _.get(row, 'multiRef.paidAmount', ''),
          tefDate: _.get(row, 'multiRef.tefDate', ''),
          tefTime: _.get(row, 'multiRef.tefTime', ''),
          tefNsu: _.get(row, 'multiRef.tefNsu', ''),
          tefAuthNumber: _.get(row, 'multiRef.tefAuthNumber', ''),
          tefTid: _.get(row, 'multiRef.tefTid', ''),
          tefCardNumber: _.get(row, 'multiRef.tefCardNumber', ''),
          tefParcelType: _.get(row, 'multiRef.tefParcelType', ''),
          keyNotes: _.get(row, 'keys.notes', ''),
          userName: _.get(row, 'keys.userData.name', ''),
          keyCommon: _.get(row, 'keyCommon', ''),
          concId: _.get(row, 'id', ''),
        };
      data.push(item);
    }

    return data;
  };
}

export default ConciliationItems;

