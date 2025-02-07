import _ from 'lodash'
import { postgres } from 'app/models'
import accountingConfig from 'config/accounting';
import sequelize, { Model, DataTypes, Op, literal } from 'sequelize';

const queryReference = `(SELECT MAX(T50."sourceId") From "customerReferences" T50
                         WHERE T50."sourceName" = 'vindi' and T50."customerId" = "customerCredits"."customerId")`;

class CustomerCredits extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      date: DataTypes.STRING,
      amount: DataTypes.DECIMAL(13, 2),
      balance: DataTypes.DECIMAL(13, 2),
      sourceName: DataTypes.STRING,
      sourceDb: DataTypes.STRING,
      sourceId: DataTypes.STRING,
      tag: DataTypes.STRING,
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
    this.hasMany(models.accountingItems, { foreignKey: 'sourceId', as: 'accountingData' });
  }

  static async listIssues(tags, from, to) {
    let data = [],
      attributes = ['balance', [literal(queryReference), 'vindiId']],
      where = {
        date: { [Op.gte]: from, [Op.lte]: to },
        sourceDb: 'vindiIssues',
        isActive: 'true'
      },
      include = [{
        model: postgres.Customer,
        as: 'customerData',
        required: true,
        attributes: ['vatNumber', 'name', 'email', 'phone']
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
            model: postgres.Sales,
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
        vindiId: _.get(o, 'vindiId', ''),
        billId: billId,
        chargeId: _.get(o, 'issuesData.chargeData.id', ''),
        taxDate: _.get(o, 'issuesData.createDate', ''),
        status: _.get(o, 'issuesData.chargeData.saleData.tag', ''),
        vatNumber: _.get(o, 'customerData.vatNumber', ''),
        email: _.get(o, 'customerData.email', ''),
        phone: _.get(o, 'customerData.phone', ''),
        name: _.get(o, 'customerData.name', ''),
        amount: _.get(o, 'issuesData.chargeData.amount', 0),
        balance: _.get(o, 'balance', 0)
      })
    })

    return data;
  }

  static async listBills(tags, from, to) {
    let data = [],
      attributes = ['balance', [literal(queryReference), 'vindiId']],
      where = {
        date: { [Op.gte]: from, [Op.lte]: to },
        sourceDb: 'sales_vindi_bills',
        isActive: 'true'
      },
      include = [{
        model: postgres.Customer,
        as: 'customerData',
        required: true,
        attributes: ['vatNumber', 'name', 'email', 'phone']
      }, {
        model: postgres.Sales,
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
        vindiId: _.get(o, 'vindiId', ''),
        billId: billId,
        chargeId: '',
        taxDate: _.get(o, 'saleData.taxDate', ''),
        status: _.get(o, 'saleData.tag', ''),
        vatNumber: _.get(o, 'customerData.vatNumber', ''),
        email: _.get(o, 'customerData.email', ''),
        phone: _.get(o, 'customerData.phone', ''),
        name: _.get(o, 'customerData.name', ''),
        amount: _.get(o, 'saleData.amount', 0),
        balance: _.get(o, 'balance', 0)
      })
    })

    return data;
  }

  static async getReportSaldos(tags, from, to) {
    let result = [];

    result = _.concat(result, await this.listIssues(tags, from, to));
    result = _.concat(result, await this.listBills(tags, from, to));

    result = _.sortBy(result, ['name', 'billId']);

    return result;
  }

  static async listAccounting({refDate}) {
    let attributes = ['id', 'amount'],
      where = {
        '$saleData.refDate$': { [Op.gte]: accountingConfig.startDate },
        '$saleData.cancelDate$': {
          [Op.gte]: accountingConfig.startDate,
          [Op.lte]: refDate
        },
        '$saleData.status$': 'canceled',
        '$accountingData.id$': null
      },
      include = [{
        model: postgres.Sales,
        as: 'saleData',
        required: true,
        attributes: ['id', 'sourceName', 'tag', 'cancelDate'],
        where: { sourceDb: 'sales_vindi_bills' },
        include: [{
          model: postgres.SalePayments,
          as: 'payments',
          required: true,
          attributes: ['id'],
          where: { type: { [Op.eq]: 'billCredit' } }
        }]
      },{
        model: postgres.AccountingItems,
        as: 'accountingData',
        required: false,
        attributes: ['id'],
        where: { 'sourceDb': 'customerCredits' }
      }];
    return await this.findAll({ attributes, where, include })
  }
}

export default CustomerCredits;
