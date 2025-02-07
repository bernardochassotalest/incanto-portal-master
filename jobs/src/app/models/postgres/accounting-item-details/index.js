import { Model, DataTypes } from 'sequelize';

class AccountingItemDetails extends Model {
  static init(sequelize) {
    super.init({
      accountingItemId: { type: DataTypes.STRING, primaryKey: true },
      shortName: DataTypes.STRING,
      costingCenter: DataTypes.STRING,
      project: DataTypes.STRING,
    },
    {
      sequelize, modelName: 'accountingItemDetails'
    });
  }

  static associate(models) {
    this.belongsTo(models.accountingItems, { foreignKey: 'accountingItemId', as: 'acctData' });
  }
}

export default AccountingItemDetails;
