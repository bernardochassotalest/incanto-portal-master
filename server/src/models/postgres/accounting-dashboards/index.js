import { Model, DataTypes } from 'sequelize';

class AccountingDashboards extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      group: DataTypes.STRING,
      type: DataTypes.ENUM(['invoiced', 'notCaptured', 'settlement']),
      visOrder: DataTypes.INTEGER,
      factor: DataTypes.DECIMAL(5, 2),
    },
    {
      sequelize, modelName: 'accountingDashboards'
    });
  }
}

export default AccountingDashboards;
