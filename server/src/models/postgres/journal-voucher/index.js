import _ from 'lodash';
import { postgres } from 'models'
import sequelize, { Model, DataTypes, Op } from 'sequelize';

const vindiBillUrl = process.env.VINDI_BILL_URL;
const newcOrderUrl = process.env.NEWC_ORDER_URL;

class  JournalVoucher extends Model {
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
        projectId: DataTypes.STRING,
        pointOfSale: DataTypes.STRING,
        championshipId: DataTypes.STRING,
        matchId: DataTypes.STRING,
        calculationId: DataTypes.STRING,
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
    this.hasMany(models.journalVoucherItems, { foreignKey: 'jeId', sourceKey: 'id', as: 'items' });
    this.hasMany(models.accountingItems, { foreignKey: 'jeId', sourceKey: 'id', as: 'acctItems' });
  };

  static async listDashboardBase(type, dateFilter, from, to, tags = []) {
    let data = [], totalAmount = 0,
      where = {
        [dateFilter]: { [Op.gte]: from, [Op.lte]: to }
      },
      attributes = ['group', [sequelize.fn('max', sequelize.col('groupData->dashboards.factor')), 'factor']],
      include = [{
        model: postgres.AccountingModelGroups,
        as: 'groupData',
        required: true,
        attributes: ['name'],
        include: [{
          model: postgres.AccountingDashboards,
          as: 'dashboards',
          required: true,
          where: { type },
          attributes: []
        }]
      }],
      group = ['journalVouchers.group', 'groupData.name',
               'groupData->dashboards.visOrder'],
      order = [ ['groupData', 'dashboards', 'visOrder', 'ASC'] ];

    if (type == 'creditCard') {
      where = {
        '$acctItems.saleAcct.saleData.taxDate$': { [Op.gte]: from, [Op.lte]: to }
      };
      let confInclude = {
          model: postgres.AccountingItem,
          as: 'acctItems',
          required: true,
          attributes: [],
          include: [{
            model: postgres.SaleAccountings,
            as: 'saleAcct',
            required: true,
            attributes: [],
            include: [{
              model: postgres.Sale,
              as: 'saleData',
              required: true,
              attributes: []
            }]
          }]
        };
      include.push(confInclude);
      attributes.push([sequelize.fn('sum', sequelize.col('acctItems.saleAcct.amount')), 'amount']);
    } else {
      include.push({ model: postgres.AccountingItem, as: 'acctItems', required: true, attributes: []});
      attributes.push([sequelize.fn('sum', sequelize.col('acctItems.amount')), 'amount']);
    }

    if (_.isEmpty(tags) == false) {
      where['tag'] = { [Op.in]: tags };
    }

    const list = await this.findAll({where, attributes, include, group, order, raw: true });
    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        factor = _.get(row, 'factor') || 1,
        amount = _.get(row, 'amount', 0),
        item = {
          group: _.get(row, 'group', ''),
          name: _.get(row, 'groupData.name', ''),
          amount: (factor * amount)
        };
      if (_.includes(['settlement', 'fee'], type) == false) {
        item['filterDetail'] = {
          group: _.get(item, 'group', ''),
          field: dateFilter,
          startDate: from,
          endDate: to,
          tags
        };
      }
      totalAmount += item.amount;
      data.push(item);
    }
    if (_.isEmpty(data) == false) {
      data.push({group: 'total', name: 'Total', amount: _.round(totalAmount, 2)});
    }
    return data;
  };

  static async listDashboardSettlement(field, from, to, tags) {
    return this.listDashboardBase('settlement', 'refDate', from, to, tags);
  };

  static async listDashboardInvoiced(field, from, to, tags) {
    return this.listDashboardBase('invoiced', field, from, to, tags);
  };

  static async listDashboardNotCaptured(field, from, to, tags) {
    return this.listDashboardBase('notCaptured', field, from, to, tags);
  };

  static async listDashboardCreditcard(field, from, to, tags) {
    return this.listDashboardBase('creditCard', field, from, to, tags);
  };

  static async listDashboardSlip(field, from, to, tags) {
    return this.listDashboardBase('slip', field, from, to, tags);
  };

  static async listDashboardDirectDebit(field, from, to, tags) {
    return this.listDashboardBase('directDebit', field, from, to, tags);
  };

  static async listDashboardPECLD(field, from, to, tags) {
    return this.listDashboardBase('pecld', field, from, to, tags);
  };

  static async listDashboardCanceled(field, from, to, tags) {
    return this.listDashboardBase('canceled', field, from, to, tags);
  };

  static async listDashboardFee(field, from, to, tags) {
    return this.listDashboardBase('fee', field, from, to, tags);
  };

  static async listDashboardErrors(from, to, tags) {
    let data = [],
      where = {
        refDate: { [Op.gte]: from, [Op.lte]: to },
        status: 'error'
      },
      attributes = ['tag', [sequelize.fn('count', sequelize.col('id')), 'count'],
                           [sequelize.fn('sum', sequelize.col('locTotal')), 'amount']],
      group = ['journalVouchers.tag'],
      order = [['tag', 'ASC']];
    if (_.isEmpty(tags) == false) {
      where['tag'] = { [Op.in]: tags };
    }
    const list = await this.findAll({where, attributes, group, order, raw: true });

    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        tag = _.get(row, 'tag', ''),
        item = {
          ruleCode: 'lcm_error',
          ruleName: 'Erro em Lançamento Contábil',
          source: _.capitalize(tag),
          count: _.toNumber(_.get(row, 'count', 0)),
          amount: _.toNumber(_.get(row, 'amount') || 0),
          filterJV: {
            tag: tag,
            startDate: from,
            endDate: to,
          }
        };
      data.push(item);
    }

    return data;
  };

  static async listDashboardErrorsDetail(tag, from, to, offset = 0) {
    let limit = PAGE_SIZE,
      where = {
        refDate: { [Op.gte]: from, [Op.lte]: to },
        tag: tag,
        status: 'error'
      },
      attributes = ['id', 'tag', 'refDate', 'taxDate', 'dueDate', 'locTotal', 'logMessage'],
      include = [{
        model: postgres.AccountingModelGroups,
        as: 'groupData',
        required: true,
        attributes: ['name']
      }],
      group = ['journalVouchers.tag'],
      order = [['tag', 'ASC'], ['groupData', 'name', 'ASC'], ['refDate', 'ASC'], ['locTotal', 'ASC']];

    offset = isNaN(offset) ? 0 : offset * 1;

    let { count = 0, rows = [] } = await this.findAndCountAll({where, attributes, include, order, offset, limit, raw:true });
    const data = rows.map((o) => {
      let billId = _.get(o, 'chargeData.billId') || '',
        row = {
          id: _.get(o, 'id', ''),
          tag: _.get(o, 'tag', ''),
          group: _.get(o, 'groupData.name', ''),
          refDate: _.get(o, 'refDate', ''),
          taxDate: _.get(o, 'taxDate', ''),
          dueDate: _.get(o, 'dueDate', ''),
          locTotal: _.get(o, 'locTotal', 0),
          logMessage: _.get(o, 'logMessage', '')
        };
      return row;
    })

    return { rows: data, offset, count, limit };
  };

  static async listBills(group, field, from, to, tags, offset = 0) {
    let limit = PAGE_SIZE,
      where = {
        group: group,
        [field]: { [Op.gte]: from, [Op.lte]: to }
      },
      attributes = ['tag', 'transId', 'refDate', 'taxDate', 'dueDate'],
      include = [{
        model: postgres.AccountingItem,
        as: 'acctItems',
        required: true,
        attributes: ['amount'],
        include: [{
          model: postgres.SaleAccountings,
          as: 'saleAcct',
          required: true,
          attributes: ['id', 'amount'],
          include: [{
            model: postgres.Sale,
            as: 'saleData',
            required: true,
            attributes: ['id', ['sourceName', 'source'], ['sourceId', 'billId'], 'status'],
            include: [{
              model: postgres.Customer,
              as: 'customer',
              required: true,
              attributes: ['vatNumber', 'name']
            }]
          }]
        }]
      }],
      order = [
        ['acctItems', 'saleAcct', 'saleData', 'customer', 'name', 'ASC'],
        ['acctItems', 'saleAcct', 'saleData', 'sourceId', 'ASC'],
        ['dueDate', 'ASC'],
        ['acctItems', 'amount', 'DESC'],
      ];

    offset = isNaN(offset) ? 0 : offset * 1;

    let { count = 0, rows = [] } = await this.findAndCountAll({where, attributes, include, order, offset, limit, subQuery: false, raw:true });
    const data = rows.map((o) => {
      let billId = _.get(o, 'acctItems.saleAcct.saleData.billId') || '',
        source = _.get(o, 'acctItems.saleAcct.saleData.source', ''),
        row = {
          id: _.get(o, 'acctItems.saleAcct.saleData.id', ''),
          source: source,
          tag: _.get(o, 'tag', ''),
          billId: billId,
          status: _.get(o, 'acctItems.saleAcct.saleData.status', ''),
          transId: _.get(o, 'transId', ''),
          refDate: _.get(o, 'refDate', ''),
          taxDate: _.get(o, 'taxDate', ''),
          dueDate: _.get(o, 'dueDate', ''),
          vatNumber: _.get(o, 'acctItems.saleAcct.saleData.customer.vatNumber', ''),
          name: _.get(o, 'acctItems.saleAcct.saleData.customer.name', ''),
          amount: _.get(o, 'acctItems.saleAcct.amount', 0),
          url: ''
        };
      if (_.isEmpty(billId) == false) {
        if (source == 'vindi') {
          _.set(row, 'url', `${vindiBillUrl}/${billId}`)
        } else if (source == 'newc') {
          _.set(row, 'url', `${newcOrderUrl}/${billId}`)
        }
      }
      return row;
    })
    return { rows: data, offset, count, limit };
  };

  static async listPdfSummary(field, from, to, tags) {
    let where = {
        [field]: { [Op.gte]: from, [Op.lte]: to }
      },
      attributes = [[sequelize.fn('sum', sequelize.col('items.debit')), 'debit'],
                    [sequelize.fn('sum', sequelize.col('items.credit')), 'credit'],
                    [sequelize.fn('sum', sequelize.col('items.balance')), 'balance']],
      include = [{
        model: postgres.AccountingModelGroups,
        as: 'groupData',
        required: true,
        attributes: ['name']
      },{
        model: postgres.JournalVoucherItem,
        as: 'items',
        required: true,
        attributes: ['account'],
        include: [{
          model: postgres.ChartOfAccounts,
          as: 'accountData',
          required: true,
          attributes: ['acctCode', 'acctName']
        }]
      }],
      group = ['journalVouchers.group', 'groupData.name', 'groupData.visOrder', 'items.account',
               'items->accountData.acctCode', 'items->accountData.acctName'],
      order = [['groupData', 'visOrder', 'ASC'],
               ['items', 'accountData', 'acctCode', 'ASC']];
    if (_.isEmpty(tags) == false) {
      where['tag'] = { [Op.in]: tags };
    }

    const list = await this.findAll({where, attributes, include, group, order, raw: true });
    const data = list.map((o) => {
      let row = {
        group: _.get(o, 'groupData.name', ''),
        acctCode: _.get(o, 'items.accountData.acctCode', ''),
        acctName: _.get(o, 'items.accountData.acctName', ''),
        debit: _.get(o, 'debit', 0),
        credit: _.get(o, 'credit', 0),
        balance: _.get(o, 'balance', 0),
      }
      return row;
    })
    return data;
  }

  static async listPdfDetails(from, to, tags) {
    return [];
  }

};

export default JournalVoucher;
