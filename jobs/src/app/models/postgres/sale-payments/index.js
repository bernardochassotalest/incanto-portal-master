import { Model, DataTypes, Op } from 'sequelize';
import { postgres } from 'app/models'

class SalePayments extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      sourceName: DataTypes.STRING,
      sourceDb: DataTypes.STRING,
      sourceId: DataTypes.STRING,
      saleId: DataTypes.STRING,
      tag: DataTypes.STRING,
      refDate: DataTypes.STRING,
      taxDate: DataTypes.STRING,
      dueDate: DataTypes.STRING,
      amount: DataTypes.DECIMAL(13, 2),
      status: DataTypes.ENUM(['pending', 'paid', 'canceled']),
      type: DataTypes.ENUM(['none', 'creditcard', 'slip', 'bankDebit', 'check', 'money', 'balance']),
      isConcilied: DataTypes.BOOLEAN,
      timeLog: DataTypes.STRING,
    },
    {
      sequelize, modelName: 'salePayments'
    });
  }

  static associate(models) {
    this.belongsTo(models.sales, { foreignKey: 'saleId', as: 'saleData' });
    this.hasMany(models.accountingItems, { foreignKey: 'sourceId', as: 'accountingData' });
  }

  static async listAccounting({refDate}) {
    let attributes = ['id', 'sourceName', 'tag', 'saleId', 'refDate', 'taxDate', 'dueDate', 'amount'],
      where = {
          refDate: refDate,
          type: { [Op.eq]: 'billCredit' },
          '$accountingData.id$': null
      },
      include = [{
        model: postgres.AccountingItems,
        as: 'accountingData',
        required: false,
        attributes: ['id'],
        where: { 'sourceDb': 'salePayments' }
      }];
    return await this.findAll({ attributes, where, include })
  }
}

export default SalePayments;
