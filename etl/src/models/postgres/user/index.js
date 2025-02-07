import { Model, DataTypes } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    super.init({}, { sequelize, modelName: 'users' });
  }

  static associate(models) {
    this.belongsTo(models.accounts, { foreignKey: 'accountId', as: 'account' });
    this.belongsTo(models.profiles, { foreignKey: 'profileId', as: 'profile' });
  }
}

export default User;