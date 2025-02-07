import { Model, DataTypes } from 'sequelize';

class ConciliationAccounts extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      type: DataTypes.ENUM(['none', 'account', 'finance']),
    },
    {
      sequelize, modelName: 'conciliationAccounts'
    });
  }

  static associate(models) {
    this.belongsTo(models.chartOfAccounts, { foreignKey: 'id', as: 'acctData' });
    this.belongsTo(models.businessPartners, { foreignKey: 'userId', as: 'bpData' });
  }
}

export default ConciliationAccounts;
