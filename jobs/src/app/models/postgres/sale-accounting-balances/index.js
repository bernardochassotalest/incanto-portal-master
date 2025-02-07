import { Model, DataTypes } from 'sequelize';

class SaleAccountingBalances extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      type: DataTypes.ENUM(['none', 'sale', 'slip', 'creditCard', 'directDebit', 'billCredit', 'notCaptured', 'pecld']),
      balance: DataTypes.DECIMAL(13, 2),
    },
    {
      sequelize, modelName: 'saleAccountingBalances'
    });
  }

  static associate(models) {
    this.belongsTo(models.saleAccountings, { foreignKey: 'saleAccountingId', as: 'saleData' });
  }
}

export default SaleAccountingBalances;
