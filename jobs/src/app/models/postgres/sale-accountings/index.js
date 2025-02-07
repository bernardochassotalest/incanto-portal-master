import _ from 'lodash';
import { postgres } from 'app/models';
import accountingConfig from 'config/accounting';
import sequelize, { Model, DataTypes, Op } from 'sequelize';

class SaleAccountings extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      amount: DataTypes.DECIMAL(13, 2),
      timeLog: DataTypes.STRING,
    },
    {
      sequelize, modelName: 'saleAccountings'
    });
  }

  static associate(models) {
    this.belongsTo(models.sales, { foreignKey: 'saleId', as: 'saleData' });
    this.belongsTo(models.accountingItems, { foreignKey: 'accountingItemId', as: 'acctData' });
    this.hasMany(models.saleAccountingBalances, { foreignKey: 'saleAccountingId', sourceKey: 'id', as: 'balances' });
  }

  static listLoadCreditCardBalances() {
    let attributes = ['id', 'amount'],
      where = {
        '$balances.id$': null
      },
      include = [{
        model: postgres.AccountingItems,
        as: 'acctData',
        required: true,
        attributes: ['id'],
        include: [{
          model: postgres.AccountConfigs,
          as: 'accountingData',
          required: true,
          attributes: ['model'],
          where: { model: 'adq_captura' }
        }]
      },{
        model: postgres.SaleAccountingBalances,
        as: 'balances',
        required: false,
        attributes: ['id'],
        where: { type: 'creditCard' }
      },{
        model: postgres.Sales,
        as: 'saleData',
        required: true,
        attributes: ['id'],
        where: {
          refDate: { [Op.gte]: accountingConfig.startDate }
        }
      }]
    return this.findAll({ attributes, where, include, raw: true })
  }
}

export default SaleAccountings;

