import { Model, DataTypes } from 'sequelize';

class AccountingModelGroups extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      name: DataTypes.STRING,
      visOrder: DataTypes.INTEGER,
    },
    {
      sequelize, modelName: 'accountingModelGroups'
    });
  }

  static associate(models) {
    this.hasMany(models.accountingDashboards, { foreignKey: 'group', sourceKey: 'id', as: 'dashboards' });
  };
}

export default AccountingModelGroups;

