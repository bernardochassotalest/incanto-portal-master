import { Model, DataTypes } from 'sequelize';

class Profile extends Model {
  static init(sequelize) {
    super.init({}, { sequelize, modelName: 'profiles' });
  }

  static associate(models) {
    this.belongsTo(models.accounts, { foreignKey: 'accountId', as: 'account' });
  }
}

export default Profile;
