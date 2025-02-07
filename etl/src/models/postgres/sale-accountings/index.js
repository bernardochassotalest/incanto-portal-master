import { Model, DataTypes } from 'sequelize';

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
    this.belongsTo(models.accountingItems, { foreignKey: 'accountingItemId', as: 'accountingData' });
  }
}

export default SaleAccountings;
