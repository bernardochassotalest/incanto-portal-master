import { Model, DataTypes } from 'sequelize';

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
  }
}

export default CustomerCredits;
