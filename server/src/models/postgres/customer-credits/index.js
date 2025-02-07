import _ from 'lodash';
import { postgres } from 'models'
import sequelize, { Model, DataTypes, Op, literal } from 'sequelize';

const vindiBillUrl = process.env.VINDI_BILL_URL;

class CustomerCredits extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      tag: DataTypes.STRING,
      date: DataTypes.STRING,
      amount: DataTypes.DECIMAL(13, 2),
      balance: DataTypes.DECIMAL(13, 2),
      sourceName: DataTypes.STRING,
      sourceDb: DataTypes.STRING,
      sourceId: DataTypes.STRING,
      isActive: DataTypes.ENUM(['none', 'true', 'false']),
    },
    {
      sequelize, modelName: 'customerCredits'
    });
  }

  static associate(models) {
    this.belongsTo(models.customers, { foreignKey: 'customerId', as: 'customerData' });
    this.hasOne(models.sales, { sourceKey: 'sourceId', foreignKey: 'sourceId', as: 'saleData' });
    this.hasOne(models.vindiIssues, { sourceKey: 'sourceId', foreignKey: 'id', as: 'issuesData' });
  }

  static async listFiltered({customerId, balanceType = '', offset = 0}, user) {
    let data = [], limit = PAGE_SIZE,
      attributes = ['customerId', [sequelize.fn('sum', sequelize.col('balance')), 'balance']],
      where = {
        isActive: 'true'
      },
      include = [{
        model: postgres.Customer,
        as: 'customerData',
        required: true,
        attributes: ['vatNumber', 'name', 'email']
      }],
      group = ['customerCredits.customerId', 'customerData.vatNumber', 'customerData.name', 'customerData.email'],
      order = [ ['customerData', 'name', 'ASC'] ],
      having = '';
    if (_.isEmpty(customerId) == false) {
      where['customerId'] = customerId;
    }
    if (balanceType === 'gt') {
      having = literal('Sum("balance") > 0');
    } else if (balanceType === 'lt') {
      having = literal('Sum("balance") < 0');
    } else if (balanceType === 'ne') {
      having = literal('Sum("balance") <> 0');
    }
    if (!_.isEmpty(user.tags) && !user.profileId !== 1) {
      where['tag'] = user.tags;
    }
    offset = isNaN(offset) ? 0 : offset * 1;

    let { count = 0, rows = [] } = await this.findAndCountAll({ where, attributes, include, group, having, offset, limit, order, distinct: true, raw: true });

    rows.map(o => {
      data.push({
        id: _.get(o, 'customerId', ''),
        vatNumber: _.get(o, 'customerData.vatNumber', ''),
        name: _.get(o, 'customerData.name', ''),
        email: _.get(o, 'customerData.email', ''),
        balance: _.get(o, 'balance', 0)
      })
    })

    return { rows: data, offset, count: count.length, limit };
  }

  static async listIssues(customerId) {
    let data = [],
      attributes = ['balance'],
      where = {
        isActive: 'true',
        customerId: customerId,
        sourceDb: 'vindiIssues'
      },
      include = [{
        model: postgres.Customer,
        as: 'customerData',
        required: true,
        attributes: ['vatNumber', 'name', 'email']
      }, {
        model: postgres.VindiIssues,
        as: 'issuesData',
        required: true,
        attributes: ['id', 'createDate'],
        include: [{
          model: postgres.VindiCharges,
          as: 'chargeData',
          required: true,
          attributes: ['billId', 'id', 'amount'],
          include: [{
            model: postgres.Sale,
            as: 'saleData',
            required: true,
            where: { sourceDb: 'sales_vindi_bills' },
            attributes: ['id', 'tag', 'sourceName', 'taxDate', 'status']
          }]
        }]
      }],
      order = [['issuesData', 'chargeData', 'billId', 'ASC']],
      rows = await this.findAll({ attributes, where, include, order, distinct: true, raw: true });

    rows.map(o => {
      let billId = _.get(o, 'issuesData.chargeData.billId') || '',
        source = _.get(o, 'issuesData.chargeData.saleData.sourceName', '');
      data.push({
        id: _.get(o, 'issuesData.chargeData.saleData.id', ''),
        tag: _.get(o, 'issuesData.chargeData.saleData.tag', ''),
        billId: billId,
        chargeId: _.get(o, 'issuesData.chargeData.id', ''),
        taxDate: _.get(o, 'issuesData.createDate', ''),
        status: _.get(o, 'issuesData.chargeData.saleData.tag', ''),
        vatNumber: _.get(o, 'customerData.vatNumber', ''),
        name: _.get(o, 'customerData.name', ''),
        amount: _.get(o, 'issuesData.chargeData.amount', 0),
        balance: _.get(o, 'balance', 0),
        url: ((_.isEmpty(billId) == false && source == 'vindi') ? `${vindiBillUrl}/${billId}` : ''),
      })
    })

    return data;
  }

  static async listBills(customerId) {
    let data = [],
      attributes = ['balance'],
      where = {
        isActive: 'true',
        customerId: customerId,
        sourceDb: 'sales_vindi_bills'
      },
      include = [{
        model: postgres.Customer,
        as: 'customerData',
        required: true,
        attributes: ['vatNumber', 'name', 'email']
      }, {
        model: postgres.Sale,
        as: 'saleData',
        required: true,
        where: { sourceDb: 'sales_vindi_bills' },
        attributes: ['id', 'tag', 'sourceName', 'sourceId', 'taxDate', 'status', 'amount']
      }],
      order = [['saleData', 'sourceId', 'ASC']],
      rows = await this.findAll({ attributes, where, include, order, distinct: true, raw: true });

    rows.map(o => {
      let billId = _.get(o, 'saleData.sourceId') || '',
        source = _.get(o, 'saleData.sourceName', '');
      data.push({
        id: _.get(o, 'saleData.id', ''),
        tag: _.get(o, 'saleData.tag', ''),
        billId: billId,
        chargeId: '',
        taxDate: _.get(o, 'saleData.taxDate', ''),
        status: _.get(o, 'saleData.tag', ''),
        vatNumber: _.get(o, 'customerData.vatNumber', ''),
        name: _.get(o, 'customerData.name', ''),
        amount: _.get(o, 'saleData.amount', 0),
        balance: _.get(o, 'balance', 0),
        url: ((_.isEmpty(billId) == false && source == 'vindi') ? `${vindiBillUrl}/${billId}` : ''),
      })
    })

    return data;
  }

  static async listDetails(customerId) {
    let result = [];

    result = _.concat(result, await this.listIssues(customerId));
    result = _.concat(result, await this.listBills(customerId));

    return result;
  }
}

export default CustomerCredits;
