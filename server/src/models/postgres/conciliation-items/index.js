import _ from 'lodash'
import { postgres } from 'models'
import sequelize, { Model, DataTypes, Op, literal } from 'sequelize';

const vindiBillUrl = process.env.VINDI_BILL_URL;

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
    this.hasOne(models.conciliationRules, { foreignKey: 'id', sourceKey: 'rule', as: 'ruleData' });
    this.hasOne(models.conciliationKeys, { foreignKey: 'conciliationItemId', sourceKey: 'id', as: 'keys' });
    this.belongsTo(models.slipOccurrences, { sourceKey: 'id', foreignKey: 'sourceId', as: 'slipRef' });
    this.belongsTo(models.slipFees, { sourceKey: 'id', foreignKey: 'sourceId', as: 'feesRef' });
    this.belongsTo(models.directDebitOccurrences, { sourceKey: 'id', foreignKey: 'sourceId', as: 'debitRef' });
    this.belongsTo(models.acquirerTransactions, { sourceKey: 'id', foreignKey: 'sourceId', as: 'cardRef' });
    this.belongsTo(models.acquirerBatches, { sourceKey: 'id', foreignKey: 'sourceId', as: 'batchRef' });
    this.belongsTo(models.bankStatements, { sourceKey: 'id', foreignKey: 'sourceId', as: 'bankRef' });
    this.belongsTo(models.vindiTransactions, { sourceKey: 'id', foreignKey: 'sourceId', as: 'vindiRef' });
    this.belongsTo(models.multiclubesPayments, { sourceKey: 'id', foreignKey: 'sourceId', as: 'multiRef' });
  }

  static async checkBalance(ids) {
    let where = {
        id: {
          [Op.in]: ids
        }
      },
      attributes = [
        [sequelize.fn('count', sequelize.col('id')), 'count'],
        [sequelize.fn('sum', sequelize.col('balance')), 'balance'],
      ],
      data = _.first(await this.findAll({where, attributes, raw: true }) || []);
    data['count'] = _.toNumber(data.count);
    return data;
  }

  static async listDashboard(from, to) {
    let data = [],
      where = {
        date: { [Op.gte]: from, [Op.lte]: to },
        '$keys.keyId$': null
      },
      attributes = ['rule', 'sourceName',
                    [sequelize.fn('count', sequelize.col('name')), 'count'],
                    [sequelize.fn('sum', sequelize.col('credit')), 'credit'],
                    [sequelize.fn('sum', sequelize.col('debit')), 'debit']
      ],
      include = [{
        model: postgres.ConciliationRules,
        as: 'ruleData',
        required: true,
        attributes: ['name']
      },{
        model: postgres.ConciliationKeys,
        as: 'keys',
        required: false,
        attributes: []
      }],
      group = ['conciliationItems.rule', 'conciliationItems.sourceName', 'ruleData.id', 'ruleData.name'],
      order = [
        ['ruleData', 'name', 'ASC'],
        ['sourceName', 'ASC']
      ],
      list = await this.findAll({where, attributes, include, group, order, raw: true });

    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        item = {
          ruleCode: _.get(row, 'rule', ''),
          ruleName: _.get(row, 'ruleData.name', ''),
          source: _.capitalize(_.get(row, 'sourceName', '')),
          count: _.toNumber(_.get(row, 'count', 0)),
          amount: _.toNumber(_.get(row, 'debit') || 0) + _.toNumber(_.get(row, 'credit') || 0)
        };
      data.push(item);
    }

    return data;
  };

  static async listFromVindi(rule, from, to, type) {
    let data = [],
      where = {
        date: { [Op.gte]: from, [Op.lte]: to },
        rule: rule,
        sourceDb: 'vindiTransactions',
        '$keys.keyId$': null
      },
      attributes = ['id', 'sourceName', 'date', 'balance'],
      include = [{
        model: postgres.ConciliationKeys,
        as: 'keys',
        required: false,
        attributes: []
      }, {
        model: postgres.VindiTransactions,
        as: 'vindiRef',
        required: true,
        attributes: ['authorization', 'tid', 'nsu', 'amount'],
        include: [{
          model: postgres.VindiCharges,
          as: 'chargeData',
          required: true,
          attributes: ['billId'],
          include: [{
            model: postgres.Sale,
            as: 'saleData',
            required: false,
            where: { sourceDb: 'sales_vindi_bills' },
            attributes: ['tag'],
            include: [{
              model: postgres.Customer,
              as: 'customer',
              required: false,
              attributes: ['vatNumber', 'name']
            }]
          }]
        }, {
          model: postgres.SalePayment,
          as: 'payData',
          required: false,
          where: { sourceDb: 'vindiTransactions' },
          attributes: ['saleId', 'dueDate'],
          include: [{
            model: postgres.PaymentSlips,
            as: 'slip',
            required: false,
            attributes: ['bank']
          },{
            model: postgres.PaymentDirectDebits,
            as: 'directDebit',
            required: false,
            attributes: ['bank']
          },{
            model: postgres.PaymentCreditcards,
            as: 'cards',
            required: false,
            attributes: ['acquirer', 'time']
          }]
        }]
      }],
      order = [
        ['date', 'ASC'],
        ['vindiRef', 'authorization', 'ASC']
      ],
      list = await this.findAll({where, attributes, include, order });

    for (var i = 0; i < list.length; i++) {
      let row = list[i],
        billId = _.get(row, 'vindiRef.chargeData.billId', ''),
        item = {
          id: _.get(row, 'id', ''),
          source: _.get(row, 'sourceName', ''),
          tag: _.get(row, 'vindiRef.chargeData.saleData.tag', ''),
          acquirer: _.get(row, 'vindiRef.payData.cards.acquirer', ''),
          bank: _.get(row, 'vindiRef.payData.slip.bank') || _.get(row, 'vindiRef.payData.directDebit.bank'),
          date: _.get(row, 'date', ''),
          dueDate: _.get(row, 'vindiRef.payData.dueDate', ''),
          time: _.get(row, 'vindiRef.payData.cards.time', ''),
          nsu: _.get(row, 'vindiRef.nsu', ''),
          authorization: _.get(row, 'vindiRef.authorization', ''),
          tid: _.get(row, 'vindiRef.tid', ''),
          amount: _.get(row, 'vindiRef.amount', ''),
          balance: _.get(row, 'balance', ''),
          billId: billId,
          vatNumber: _.get(row, 'vindiRef.chargeData.saleData.customer.vatNumber', ''),
          name: _.get(row, 'vindiRef.chargeData.saleData.customer.name', ''),
          url: (_.isEmpty(billId) == false ? `${vindiBillUrl}/${billId}` : ''),
        };
      if ((type == 'slip') || (type == 'directDebit')){
        delete item.acquirer;
        delete item.time;
        delete item.nsu;
        delete item.tid;
      } else if (type == 'cards') {
        delete item.bank;
        delete item.dueDate;
      }
      data.push(item);
    }

    return data;
  }

  static async listFromMulticlubes(rule, from, to) {
    let data = [],
      where = {
        date: { [Op.gte]: from, [Op.lte]: to },
        rule: rule,
        sourceDb: 'multiclubesPayments',
        '$keys.keyId$': null
      },
      attributes = ['id', 'sourceName', 'date', 'balance'],
      include = [{
        model: postgres.ConciliationKeys,
        as: 'keys',
        required: false,
        attributes: []
      }, {
        model: postgres.MulticlubesPayments,
        as: 'multiRef',
        required: true,
        attributes: ['tefInstitution', 'tefTime', 'tefNsu', 'tefAuthNumber', 'tefTid', 'paidAmount',
                     'paymentId', 'memberVatNumber', 'memberName']
      }],
      order = [
        ['date', 'ASC'],
        ['multiRef', 'tefTime', 'ASC'],
        ['multiRef', 'tefNsu', 'ASC'],
      ],
      list = await this.findAll({where, attributes, include, order });

    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        item = {
          id: _.get(row, 'id', ''),
          source: _.get(row, 'sourceName', ''),
          tag: 'multiclubes',
          acquirer: _.get(row, 'multiRef.tefInstitution', ''),
          date: _.get(row, 'date', ''),
          time: _.get(row, 'multiRef.tefTime', ''),
          nsu: _.get(row, 'multiRef.tefNsu', ''),
          authorization: _.get(row, 'multiRef.tefAuthNumber', ''),
          tid: _.get(row, 'multiRef.tefTid', ''),
          amount: _.get(row, 'multiRef.paidAmount', 0),
          balance: _.get(row, 'balance', 0),
          billId: _.get(row, 'multiRef.paymentId', ''),
          vatNumber: _.get(row, 'multiRef.memberVatNumber', ''),
          name: _.get(row, 'multiRef.memberName', ''),
          url: '',
        };
      data.push(item);
    }

    return data;
  }

  static async listFromSlip(rule, from, to, type) {
    let data = [],
      where = {
        date: { [Op.gte]: from, [Op.lte]: to },
        rule: rule,
        sourceDb: 'slipOccurrences',
        '$keys.keyId$': null
      },
      attributes = ['id', 'sourceName', 'date', 'balance'],
      include = [{
        model: postgres.ConciliationKeys,
        as: 'keys',
        required: false,
        attributes: []
      }, {
        model: postgres.SlipOccurrences,
        as: 'slipRef',
        required: true,
        attributes: ['amount'],
        include: [{
          model: postgres.SlipTransactions,
          as: 'slipData',
          required: true,
          attributes: ['tag', 'bank', 'account', 'ourNumber', 'dueDate', 'holderName']
        }]
      }],
      order = [
        ['date', 'ASC'],
        ['slipRef', 'slipData', 'ourNumber', 'ASC']
      ],
      list = await this.findAll({where, attributes, include, order });

    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        item = {
          id: _.get(row, 'id', ''),
          source: _.get(row, 'sourceName', ''),
          tag: _.get(row, 'slipRef.slipData.tag', ''),
          bank: _.get(row, 'slipRef.slipData.bank', ''),
          account: _.get(row, 'slipRef.slipData.account', ''),
          date: _.get(row, 'date', ''),
          dueDate: _.get(row, 'slipRef.slipData.dueDate', ''),
          authorization: _.get(row, 'slipRef.slipData.ourNumber', ''),
          ourNumber: _.get(row, 'slipRef.slipData.ourNumber', ''),
          amount: _.get(row, 'slipRef.amount', 0),
          balance: _.get(row, 'balance', 0),
          billId: '',
          vatNumber: '',
          name: _.get(row, 'slipRef.slipData.holderName', ''),
          notes: _.get(row, 'slipRef.slipData.holderName', ''),
          url: '',
        };
      if (type == 'capture') {
        delete item.ourNumber;
        delete item.account;
        delete item.notes;
      } else if (type == 'settlement') {
        delete item.authorization;
        delete item.billId;
        delete item.vatNumber;
        delete item.name;
        delete item.url;
      }
      data.push(item);
    }

    return data;
  }

  static async listFromDirectDebit(rule, from, to, type) {
    let data = [],
      where = {
        date: { [Op.gte]: from, [Op.lte]: to },
        rule: rule,
        sourceDb: 'directDebitOccurrences',
        '$keys.keyId$': null
      },
      attributes = ['id', 'sourceName', 'date', 'balance'],
      include = [{
        model: postgres.ConciliationKeys,
        as: 'keys',
        required: false,
        attributes: []
      }, {
        model: postgres.DirectDebitOccurrences,
        as: 'debitRef',
        required: true,
        attributes: ['amount'],
        include: [{
          model: postgres.DirectDebitTransactions,
          as: 'debitData',
          required: true,
          attributes: ['tag', ['debBank', 'bank'], ['debAccount', 'account'], 'debitNumber', 'dueDate', 'holderName']
        }]
      }],
      order = [
        ['date', 'ASC'],
        ['debitRef', 'debitData', 'debitNumber', 'ASC']
      ],
      list = await this.findAll({where, attributes, include, order });

    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        item = {
          id: _.get(row, 'id', ''),
          source: _.get(row, 'sourceName', ''),
          tag: _.get(row, 'debitRef.debitData.tag', ''),
          bank: _.get(row, 'debitRef.debitData.bank', ''),
          account: _.get(row, 'debitRef.debitData.account', ''),
          date: _.get(row, 'date', ''),
          dueDate: _.get(row, 'debitRef.debitData.dueDate', ''),
          authorization: _.get(row, 'debitRef.debitData.debitNumber', '').substr(-10),
          ourNumber: _.get(row, 'debitRef.debitData.debitNumber', ''),
          amount: _.get(row, 'debitRef.amount', 0),
          balance: _.get(row, 'balance', 0),
          billId: '',
          vatNumber: '',
          name: _.get(row, 'debitRef.debitData.holderName', ''),
          notes: _.get(row, 'debitRef.debitData.holderName', ''),
          url: '',
        };
      if (type == 'capture') {
        delete item.ourNumber;
        delete item.account;
        delete item.notes;
      } else if (type == 'settlement') {
        delete item.authorization;
        delete item.billId;
        delete item.vatNumber;
        delete item.name;
        delete item.url;
      }
      data.push(item);
    }

    return data;
  }

  static async listFromCards(rule, from, to) {
    let data = [],
      where = {
        date: { [Op.gte]: from, [Op.lte]: to },
        rule: rule,
        sourceDb: 'acquirerTransactions',
        '$keys.keyId$': null
      },
      attributes = ['id', 'sourceName', 'date', 'balance'],
      include = [{
        model: postgres.ConciliationKeys,
        as: 'keys',
        required: false,
        attributes: []
      }, {
        model: postgres.AcquirerTransaction,
        as: 'cardRef',
        required: true,
        attributes: ['tag', 'acquirer', 'captureTime', 'nsu', 'authorization', 'tid', 'grossAmount']
      }],
      order = [
        ['date', 'ASC'],
        ['cardRef', 'captureTime', 'ASC'],
        ['cardRef', 'nsu', 'ASC'],
      ],
      list = await this.findAll({where, attributes, include, order });

    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        item = {
          id: _.get(row, 'id', ''),
          source: _.get(row, 'sourceName', ''),
          tag: _.get(row, 'cardRef.tag', ''),
          acquirer: _.get(row, 'cardRef.acquirer', ''),
          date: _.get(row, 'date', ''),
          time: _.get(row, 'cardRef.captureTime', ''),
          nsu: _.get(row, 'cardRef.nsu', ''),
          authorization: _.get(row, 'cardRef.authorization', ''),
          tid: _.get(row, 'cardRef.tid', ''),
          amount: _.get(row, 'cardRef.grossAmount', 0),
          balance: _.get(row, 'balance', 0),
          billId: '',
          vatNumber: '',
          name: _.get(row, 'cardRef.holderName', ''),
          url: '',
        };
      data.push(item);
    }

    return data;
  }

  static async listFromBatches(rule, from, to) {
    let data = [],
      where = {
        date: { [Op.gte]: from, [Op.lte]: to },
        rule: rule,
        sourceDb: 'acquirerBatches',
        '$keys.keyId$': null
      },
      attributes = ['id', 'sourceName', 'date', 'balance'],
      include = [{
        model: postgres.ConciliationKeys,
        as: 'keys',
        required: false,
        attributes: []
      }, {
        model: postgres.AcquirerBatches,
        as: 'batchRef',
        required: true,
        attributes: ['tag', 'acquirer', 'bankCode', 'bankAccount', 'pointOfSale', 'batchNo',
                     'settlement', 'notes']
      }],
      order = [
        ['date', 'ASC'],
        ['balance', 'DESC'],
      ],
      list = await this.findAll({where, attributes, include, order });

    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        item = {
          id: _.get(row, 'id', ''),
          source: _.get(row, 'sourceName', ''),
          tag: _.get(row, 'batchRef.tag', ''),
          acquirer: _.get(row, 'batchRef.acquirer', ''),
          date: _.get(row, 'date', ''),
          bank: _.get(row, 'batchRef.bankCode', ''),
          account: _.get(row, 'batchRef.bankAccount', ''),
          pointOfSale: _.get(row, 'batchRef.pointOfSale', ''),
          batchNo: _.get(row, 'batchRef.batchNo', ''),
          amount: _.get(row, 'batchRef.settlement', ''),
          balance: _.get(row, 'balance', 0),
          notes: _.get(row, 'batchRef.notes', ''),
        };
      data.push(item);
    }

    return data;
  }

  static async listFromSlipFee(rule, from, to) {
    let data = [],
      where = {
        date: { [Op.gte]: from, [Op.lte]: to },
        rule: rule,
        sourceDb: 'slipFees',
        '$keys.keyId$': null
      },
      attributes = ['id', 'sourceName', 'date', 'balance'],
      include = [{
        model: postgres.ConciliationKeys,
        as: 'keys',
        required: false,
        attributes: []
      }, {
        model: postgres.SlipFees,
        as: 'feesRef',
        required: true,
        attributes: ['tag', 'bank', 'account', 'feeNumber', 'date', 'occurName', 'amount']
      }],
      order = [
        ['date', 'ASC'],
        ['feesRef', 'account', 'ASC']
      ],
      list = await this.findAll({where, attributes, include, order });

    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        item = {
          id: _.get(row, 'id', ''),
          source: _.get(row, 'sourceName', ''),
          tag: _.get(row, 'feesRef.tag', ''),
          bank: _.get(row, 'feesRef.bank', ''),
          account: _.get(row, 'feesRef.account', ''),
          date: _.get(row, 'date', ''),
          dueDate: _.get(row, 'feesRef.date', ''),
          authorization: _.get(row, 'feesRef.feeNumber', ''),
          ourNumber: _.get(row, 'feesRef.feeNumber', ''),
          amount: _.get(row, 'feesRef.amount', 0),
          balance: _.get(row, 'balance', 0),
          billId: '',
          vatNumber: '',
          name: '',
          notes: _.get(row, 'feesRef.occurName', ''),
          url: '',
        };
      data.push(item);
    }

    return data;
  }

  static async listFromBank(rule, from, to, type) {
    let data = [],
      where = {
        date: { [Op.gte]: from, [Op.lte]: to },
        rule: rule,
        sourceDb: 'bankStatements',
        '$keys.keyId$': null
      },
      attributes = ['id', 'sourceName', 'date', 'balance'],
      include = [{
        model: postgres.ConciliationKeys,
        as: 'keys',
        required: false,
        attributes: []
      }, {
        model: postgres.BankStatements,
        as: 'bankRef',
        required: true,
        attributes: ['acquirer', 'bank', 'account', 'pointOfSale', 'debit', 'credit', 'notes']
      }],
      order = [
        ['date', 'ASC'],
        ['balance', 'DESC'],
      ],
      list = await this.findAll({where, attributes, include, order });

    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        debit = _.get(row, 'bankRef.debit', 0),
        credit = _.get(row, 'bankRef.credit', 0),
        item = {
          id: _.get(row, 'id', ''),
          source: _.get(row, 'sourceName', ''),
          tag: '',
          acquirer: _.get(row, 'bankRef.acquirer', ''),
          date: _.get(row, 'date', ''),
          bank: _.get(row, 'bankRef.bank', ''),
          account: _.get(row, 'bankRef.account', ''),
          ourNumber: '',
          pointOfSale: _.get(row, 'bankRef.pointOfSale', ''),
          batchNo: '',
          amount: _.round(debit + credit, 2),
          balance: _.get(row, 'balance', 0),
          notes: _.get(row, 'bankRef.notes', ''),
        };
      if ((type == 'slip') || (type == 'directDebit') || (type == 'slipFee')){
        delete item.acquirer;
        delete item.pointOfSale;
        delete item.batchNo;
      } else if (type == 'cards') {
        delete item.ourNumber;
      }
      data.push(item);
    }
    return data;
  }

  static async listTransactions(rule, from, to) {
    let data = [];
    if (_.includes(['slip_capture', 'slip_canceled'], rule) == true) {
      data = _.concat(data, await this.listFromVindi(rule, from, to, 'slip'));
      data = _.concat(data, await this.listFromSlip(rule, from, to, 'capture'));
      data = _.sortBy(data, (o) => { return `${o.date}-${_.padStart(o.authorization, 20, '0')}`});
    }
    if (rule == 'creditcard_capture') {
      data = _.concat(data, await this.listFromVindi(rule, from, to, 'cards'));
      data = _.concat(data, await this.listFromMulticlubes(rule, from, to));
      data = _.concat(data, await this.listFromCards(rule, from, to));
      data = _.sortBy(data, (o) => { return `${o.date}-${o.time}-${_.padStart(o.nsu, 20, '0')}`});
    }
    if (rule == 'direct_debit_capture') {
      data = _.concat(data, await this.listFromVindi(rule, from, to, 'directDebit'));
      data = _.concat(data, await this.listFromDirectDebit(rule, from, to, 'capture'));
      data = _.sortBy(data, (o) => { return `${o.date}-${_.padStart(o.authorization, 20, '0')}`});
    }
    if (rule == 'creditcard_settlement') {
      data = _.concat(data, await this.listFromBank(rule, from, to, 'cards'));
      data = _.concat(data, await this.listFromBatches(rule, from, to));
      data = _.sortBy(data, (o) => { return `${o.date}-${-1 * o.balance}`});
    }
    if (rule == 'slip_settlement') {
      data = _.concat(data, await this.listFromBank(rule, from, to, 'slip'));
      data = _.concat(data, await this.listFromSlip(rule, from, to, 'settlement'));
      data = _.sortBy(data, (o) => { return `${o.date}-${-1 * o.balance}`});
    }
    if (rule == 'slip_fee') {
      data = _.concat(data, await this.listFromBank(rule, from, to, 'slipFee'));
      data = _.concat(data, await this.listFromSlipFee(rule, from, to));
      data = _.sortBy(data, (o) => { return `${o.date}-${-1 * o.balance}`});
    }
    if (rule == 'direct_debit_settlement') {
      data = _.concat(data, await this.listFromBank(rule, from, to, 'directDebit'));
      data = _.concat(data, await this.listFromDirectDebit(rule, from, to, 'settlement'));
      data = _.sortBy(data, (o) => { return `${o.date}-${-1 * o.balance}`});
    }
    return data;
  };
}

export default ConciliationItems;

