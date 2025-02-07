
import { Model } from 'sequelize';

class Account extends Model {
  static init(sequelize) {
    super.init({}, { sequelize, modelName: 'accounts' });
  }

  static associate(models) {
    this.belongsTo(models.accounts, {foreignKey: 'accountId', as: 'account'});
  }
}

export default Account;
