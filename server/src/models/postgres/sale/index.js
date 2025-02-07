import _ from 'lodash';
import { postgres } from 'models'
import { mergeAccounting } from './helper'
import sequelize, { Model, DataTypes, Op } from 'sequelize';

const vindiBillUrl = process.env.VINDI_BILL_URL;
const newcOrderUrl = process.env.NEWC_ORDER_URL;

class Sale extends Model {
  static init(sequelize) {
    super.init(
      {
        id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
        sourceName: DataTypes.STRING,
        sourceDb: DataTypes.STRING,
        sourceId: DataTypes.STRING,
        refDate: DataTypes.STRING,
        taxDate: DataTypes.STRING,
        dueDate: DataTypes.STRING,
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
        sequelize,
        modelName: 'sales'
      }
    );
  };

  static associate(models) {
    this.hasMany(models.saleItems, { foreignKey: 'saleId', sourceKey: 'id', as: 'items' });
    this.belongsTo(models.customers, { foreignKey: 'customerId', as: 'customer' });
    this.belongsTo(models.tags, { foreignKey: 'tag', as: 'tagData' });
    this.hasMany(models.saleAccountings, { foreignKey: 'saleId', sourceKey: 'id', as: 'accountings' });
    this.hasOne(models.saleCancellations, { sourceKey: 'id', foreignKey: 'saleId', as: 'cancellation' });
    this.hasMany(models.acquirerTransactions, { foreignKey: 'saleId', sourceKey: 'id', as: 'creditcards' });
    this.hasMany(models.slipTransactions, { foreignKey: 'saleId', sourceKey: 'id', as: 'slips' });
    this.hasMany(models.directDebitTransactions, { foreignKey: 'saleId', sourceKey: 'id', as: 'debits' });
  };

  static async listDashboard(from, to, tags) {
    let data = [],
      where = {
        refDate: { [Op.gte]: from, [Op.lte]: to }
      },
      attributes = ['tag', 'sourceName',
                    [sequelize.fn('count', sequelize.col('sourceName')), 'count'],
                    [sequelize.fn('sum', sequelize.col('amount')), 'amount']
      ],
      group = ['sales.tag', 'sales.sourceName'],
      order = [['tag', 'ASC'], ['sourceName', 'ASC']];
    if (_.isEmpty(tags) == false) {
      where['tag'] = { [Op.in]: tags };
    }

    const list = await this.findAll({where, attributes, group, order, raw: true });
    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        source = _.get(row, 'sourceName', ''),
        tag = _.get(row, 'tag', ''),
        item = {
          type: '01 - Vendas',
          name: _.capitalize(source),
          group: _.capitalize(tag),
          count: _.toNumber(_.get(row, 'count', 0)),
          amount: _.toNumber(_.get(row, 'amount') || 0),
          filterSale: {
            source, tag,
            startDate: from,
            endDate: to
          }
        };
      data.push(item);
    }

    return data;
  };

  static async listDashboardDetail(source, tag, startDate, endDate, offset = 0) {
    let data = [], limit = PAGE_SIZE,
      attributes = ['id', 'sourceName', 'tag', 'sourceId', 'status', 'taxDate', 'cancelDate', 'amount'],
      where = {
        taxDate: { [Op.gte]: startDate, [Op.lte]: endDate },
        sourceName: source,
        tag: tag
      },
      include = [{
        model: postgres.Customer,
        as: 'customer',
        required: true,
        attributes: ['vatNumber', 'name']
      }],
      order = [
        ['customer', 'name', 'ASC'],
        ['taxDate', 'ASC'],
        ['sourceId', 'ASC'],
      ];

    offset = isNaN(offset) ? 0 : offset * 1;

    let { count = 0, rows = [] } = await this.findAndCountAll({ where, attributes, include, offset, limit, order, distinct: true, raw: true });

    rows.map(o => {
      let billId = _.get(o, 'sourceId') || '',
        source = _.get(o, 'sourceName', ''),
        item = {
          id: _.get(o, 'id', ''),
          source: source,
          tag: _.get(o, 'tag', ''),
          billId: billId,
          status: _.get(o, 'status', ''),
          taxDate: _.get(o, 'taxDate', ''),
          cancelDate: _.get(o, 'cancelDate', ''),
          vatNumber: _.get(o, 'customer.vatNumber', ''),
          name: _.get(o, 'customer.name', ''),
          amount: _.get(o, 'amount', 0),
          url: '',
        };
      if (_.isEmpty(billId) == false) {
        if (source == 'vindi') {
          _.set(item, 'url', `${vindiBillUrl}/${billId}`)
        } else if (source == 'newc') {
          _.set(item, 'url', `${newcOrderUrl}/${billId}`)
        }
      }
      data.push(item);
    })

    return { rows: data, offset, count, limit };
  }

  static async listBalanceBase(type, dateField, startDate, endDate, offset = 0) {
    let data = [], limit = PAGE_SIZE,
      queryGroup = `
          (Select T0."id"
           From "sales" T0
                INNER JOIN "saleAccountings" T1 ON T1."saleId" = T0."id"
                INNER JOIN "saleAccountingBalances" T2 ON T2."saleAccountingId" = T1."id"
                INNER JOIN "accountingItems" T3 ON T3."id" = T1."accountingItemId"
           Where T2."type" = '${type}' and T3."${dateField}" >= '${startDate}' and T3."${dateField}" <= '${endDate}'
           Group By T0."id"
           Having Sum(T2."balance") <> 0)`,
      where = {
        id: { [Op.in]: sequelize.literal(queryGroup) }
      },
      attributes = ['id', 'sourceName', 'tag', 'sourceId', 'status', 'taxDate', 'cancelDate', 'amount'],
      include = [{
        model: postgres.Customer,
        as: 'customer',
        required: true,
        attributes: ['vatNumber', 'name']
      }],
      order = [
        ['customer', 'name', 'ASC'],
        ['taxDate', 'ASC'],
        ['sourceId', 'ASC'],
      ];

    offset = isNaN(offset) ? 0 : offset * 1;

    let { count = 0, rows = [] } = await this.findAndCountAll({ where, attributes, include, offset, limit, order, distinct: true, raw: true });

    rows.map(o => {
      let billId = _.get(o, 'sourceId') || '',
        source = _.get(o, 'sourceName', ''),
        item = {
          id: _.get(o, 'id', ''),
          source: _.get(o, 'sourceName', ''),
          tag: _.get(o, 'tag', ''),
          billId: billId,
          status: _.get(o, 'status', ''),
          taxDate: _.get(o, 'taxDate', ''),
          cancelDate: _.get(o, 'cancelDate', ''),
          vatNumber: _.get(o, 'customer.vatNumber', ''),
          name: _.get(o, 'customer.name', ''),
          amount: _.get(o, 'amount', 0),
          url: '',
        };
      if (_.isEmpty(billId) == false) {
        if (source == 'vindi') {
          _.set(item, 'url', `${vindiBillUrl}/${billId}`)
        } else if (source == 'newc') {
          _.set(item, 'url', `${newcOrderUrl}/${billId}`)
        }
      }
      data.push(item)
    })

    return { rows: data, offset, count, limit };
  }

  static async listInvoiced(dateField, startDate, endDate, offset = 0) {
    return this.listBalanceBase('sale', dateField, startDate, endDate, offset);
  }

  static async listNotCaptured(dateField, startDate, endDate, offset = 0) {
    return this.listBalanceBase('notCaptured', dateField, startDate, endDate, offset);
  }

  static async listCreditcard(dateField, startDate, endDate, offset = 0) {
    return this.listBalanceBase('creditCard', dateField, startDate, endDate, offset);
  }

  static async listSlip(dateField, startDate, endDate, offset = 0) {
    return this.listBalanceBase('slip', dateField, startDate, endDate, offset);
  }

  static async listDirectDebit(dateField, startDate, endDate, offset = 0) {
    return this.listBalanceBase('directDebit', dateField, startDate, endDate, offset);
  }

  static async listPECLD(dateField, startDate, endDate, offset = 0) {
    return this.listBalanceBase('pecld', dateField, startDate, endDate, offset);
  }

  static async listFiltered({type, term, startDate, endDate, offset = 0}, user) {
    let data = [], limit = PAGE_SIZE,
      attributes = ['id', 'sourceName', 'tag', 'sourceId', 'status', 'taxDate', 'cancelDate', 'amount'],
      where = {},
      include = [{
        model: postgres.Customer,
        as: 'customer',
        required: true,
        attributes: ['vatNumber', 'name']
      }],
      order = [
        ['customer', 'name', 'ASC'],
        ['taxDate', 'ASC'],
        ['sourceId', 'ASC'],
      ];

    if (type == 'period') {
      where['taxDate'] = { [Op.gte]: startDate, [Op.lte]: endDate };
    }
    if (!_.isEmpty(user.tags) && !user.profileId !== 1) {
      where['tag'] = user.tags;
    }
    if (_.includes(['customerId', 'sourceId'], type) == true) {
      delete where.taxDate;
      where[type] = term;
    }
    if (type == 'transId') {
      let queryJe = `
        (Select DISTINCT T0."saleId"
         From "saleAccountings"   T0
              INNER JOIN "accountingItems" T1 ON T1."id" = T0."accountingItemId"
              INNER JOIN "journalVouchers" T2 ON T2."id" = T1."jeId"
        Where T2."transId" = '${term}')`;
      where = { id: { [Op.in]: sequelize.literal(queryJe) }};
    }
    if (type == 'ourNumber') {
      let querySlips = `(Select T0."saleId" From "slipTransactions" T0 Where T0."ourNumber" ilike '%${term}%')`;
      where = { id: { [Op.in]: sequelize.literal(querySlips) }};
    }
    if (type == 'itemCode') {
      let queryProducts = `(Select T0."saleId" From "saleItems" T0 Where T0."itemCode" = '${term}')`;
      where = { id: { [Op.in]: sequelize.literal(queryProducts) }};
    }
    if (_.includes(['authorization', 'nsu', 'tid'], type) == true) {
      let queryCards = `(Select T0."saleId" From "acquirerTransactions" T0 Where T0."${type}" ilike '%${term}%')`;
      where = { id: { [Op.in]: sequelize.literal(queryCards) }};
    }

    offset = isNaN(offset) ? 0 : offset * 1;

    let { count = 0, rows = [] } = await this.findAndCountAll({ where, attributes, include, offset, limit, order, distinct: true, raw: true });

    rows.map(o => {
      let billId = _.get(o, 'sourceId') || '',
        source = _.get(o, 'sourceName', ''),
        item = {
          id: _.get(o, 'id', ''),
          source: source,
          tag: _.get(o, 'tag', ''),
          billId: billId,
          status: _.get(o, 'status', ''),
          taxDate: _.get(o, 'taxDate', ''),
          cancelDate: _.get(o, 'cancelDate', ''),
          vatNumber: _.get(o, 'customer.vatNumber', ''),
          name: _.get(o, 'customer.name', ''),
          amount: _.get(o, 'amount', 0),
          url: '',
        };
      if (_.isEmpty(billId) == false) {
        if (source == 'vindi') {
          _.set(item, 'url', `${vindiBillUrl}/${billId}`)
        } else if (source == 'newc') {
          _.set(item, 'url', `${newcOrderUrl}/${billId}`)
        }
      }
      data.push(item);
    })

    return { rows: data, offset, count, limit };
  }

  static async getHistoricoContabil(saleId) {
    let data = [],
      group = ['rct_provisao', 'bnc_bol_captura', 'bnc_bol_liquidacao', 'bnc_bol_cancelamento', 'adq_captura',
               'lmb_to_boleto', 'lmb_to_cartao', 'lmb_provisao', 'lmb_cancelamento', 'pecld_provisao',
               'pecld_estorno', 'crd_captura', 'crd_duplicidade'],
      where = { id: saleId },
      attributes = ['sourceId', 'tag', 'refDate', 'taxDate', 'status'],
      include = [{
        model: postgres.SaleAccountings,
        as: 'accountings',
        required: true,
        attributes: [ 'amount', 'timeLog'],
        include: [{
          model: postgres.AccountingItem,
          as: 'acctData',
          required: true,
          attributes: ['refDate', 'dueDate', 'amount', 'jeId', 'debitLineId', 'creditLineId'],
          include: [{
            model: postgres.AccountConfig,
            as: 'accountConfig',
            required: true,
            attributes: ['id'],
            include: [{
              model: postgres.AccountingModel,
              as: 'accountingModel',
              required: true,
              attributes: ['name']
            }]
          },{
            model: postgres.JournalVoucher,
            as: 'journalVoucher',
            required: true,
            attributes: ['transId', 'refDate', 'taxDate', 'dueDate'],
            include: [{
              model: postgres.AccountingModelGroups,
              as: 'groupData',
              required: true,
              attributes: ['name', 'visOrder']
            }]
          }]
        }]
      }],
      order = [
        ['tag', 'ASC'],
        ['accountings', 'acctData', 'journalVoucher', 'refDate', 'ASC'],
        ['accountings', 'acctData', 'journalVoucher', 'dueDate', 'ASC'],
        ['accountings', 'acctData', 'journalVoucher', 'groupData', 'visOrder', 'ASC'],
        ['accountings', 'acctData', 'amount', 'DESC'],
      ],
      list = await this.findAll({where, attributes, include, order }), jeIds = [];

    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        lines = _.get(row, 'accountings', );

      for (let j = 0; j < lines.length; j++) {
        let line = JSON.parse(JSON.stringify(lines[j])),
          item = {
            group: _.get(line, 'acctData.journalVoucher.groupData.name', ''),
            model: _.get(line, 'acctData.accountConfig.accountingModel.name', ''),
            transId: _.get(line, 'acctData.journalVoucher.transId', ''),
            refDate: _.get(line, 'acctData.journalVoucher.refDate', ''),
            taxDate: _.get(line, 'acctData.journalVoucher.taxDate', ''),
            dueDate: _.get(line, 'acctData.journalVoucher.dueDate', ''),
            amount: _.get(line, 'amount', 0),
            jeId: _.get(line, 'acctData.jeId', ''),
            debitLineId: _.get(line, 'acctData.debitLineId', ''),
            creditLineId: _.get(line, 'acctData.creditLineId', ''),
          };
        data.push(item);
        jeIds.push(item.jeId);
      }
    }
    let accounting = await postgres.JournalVoucherItem.listBase(_.uniq(jeIds));

    mergeAccounting(data, accounting);

    return data;
  };

  static async listDetails(saleId) {
    let result = {},
      where = { id: saleId },
      attributes = [['sourceName', 'source'], 'tag', ['sourceId', 'billId'], 'status', 'taxDate', 'cancelDate',
                    'amount', 'startPeriod', 'endPeriod'],
      include = [{
        model: postgres.Customer,
        as: 'customer',
        required: true,
        attributes: ['vatNumber', 'name', 'email', 'phone', 'birthDate', 'street', 'streetNo',
                     'complement', 'neighborhood', 'zipCode', 'city', 'state']
      },{
        model: postgres.SaleItem,
        as: 'items',
        required: true,
        attributes: ['itemCode', 'itemName', 'quantity', 'unitPrice', 'discAmount',
                     'totalAmount', 'ownerVatNo', 'ownerName'],
        include: [{
          model: postgres.Memberships,
          as: 'memberships',
          required: false,
          attributes: ['sourceId']
        },{
          model: postgres.Tickets,
          as: 'tickets',
          required: false,
          attributes: ['area', 'priceGroupName', 'priceAreaName', 'priceName', 'sector', 'row', [sequelize.cast(sequelize.col('seat'),'integer'), 'seat']]
        }]
      },{
        model: postgres.AcquirerTransaction,
        as: 'creditcards',
        required: false,
        attributes: ['acquirer', 'pointOfSale', 'batchNo', 'saleType', 'captureDate', 'captureTime',
                     'nsu', 'authorization', 'tid', 'reference', 'cardNumber', 'cardBrandName',
                     'captureType', 'terminalNo', 'grossAmount', 'rate', 'commission', 'netAmount',
                     'fileName', 'fileLine'],
        include: [{
          model: postgres.AcquirerInstallment,
          as: 'installments',
          required: false,
          attributes: ['installment', 'dueDate', 'grossAmount', 'rate', 'commission', 'netAmount']
        }]
      },{
        model: postgres.SlipTransactions,
        as: 'slips',
        required: false,
        attributes: ['bank', 'branch', 'account', 'slipNumber', 'ourNumber', 'digitOurNumber',
                     'reference', 'wallet', 'refDate', 'dueDate', 'amount', 'holderName'],
        include: [{
          model: postgres.SlipOccurrences,
          as: 'occurrences',
          required: false,
          where: { type: { [Op.ne] : 'none' } },
          attributes: ['occurId', 'occurName', 'date', 'amount', 'paidPlace', 'fileName', 'fileLine']
        }]
      },{
        model: postgres.DirectDebitTransactions,
        as: 'debits',
        required: false,
        attributes: ['debBank', 'debBranch', 'debAccount', 'debitNumber', 'ourNumber',
                     'refDate', 'dueDate', 'amount', 'vatNumber', 'holderName'],
        include: [{
          model: postgres.DirectDebitOccurrences,
          as: 'occurrences',
          required: false,
          where: { type: { [Op.ne] : 'none' } },
          attributes: ['occurId', 'occurName', 'date', 'amount', 'fileName', 'fileLine']
        }]
      }];

    const list = await this.findAll({where, attributes, include }),
      saleData = JSON.parse(JSON.stringify(_.first(list))),
      source = _.get(saleData, 'source', ''),
      billId = _.get(saleData, 'billId', '');

    result['header'] = _.omit(saleData, ['items', 'creditcards', 'slips', 'debits']);
    result['items'] = saleData.items;
    result['slips'] = saleData.slips;
    result['debits'] = saleData.debits;
    result['creditcards'] = saleData.creditcards;
    result['accounting'] = await this.getHistoricoContabil(saleId);
    if (source == 'vindi') {
      _.set(result, 'header.url', (_.isEmpty(billId) == false ? `${vindiBillUrl}/${billId}` : ''));
    } else if (source == 'newc') {
      _.set(result, 'header.url', (_.isEmpty(billId) == false ? `${newcOrderUrl}/${billId}` : ''));
    }
    _.each(result.items, (o) => {
      if (_.isEmpty(o.memberships) == false) {
        o.url = `${newcOrderUrl}/${o.memberships.sourceId}`;
      }
      delete o.memberships;
      if (_.isEmpty(o.tickets) == true) {
        delete o.tickets;
      }
    });
    result.items = _.sortBy(result.items, ['tickets.area', 'tickets.sector', 'tickets.row', 'tickets.seat'])
    _.each(result.creditcards, (o) => {
      o.installments = _.sortBy(o.installments, ['installment']);
    });
    _.each(result.slips, (o) => {
      o.occurrences = _.sortBy(o.occurrences, ['occurId']);
    });
    _.each(result.debits, (o) => {
      o.occurrences = _.sortBy(o.occurrences, ['fileName']);
    });

    return result;
  }
};

export default Sale;
