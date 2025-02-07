import { Model, DataTypes } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.INTEGER, primaryKey: true },
      email: DataTypes.STRING,
      name: DataTypes.STRING,
      canNotify: DataTypes.BOOLEAN,
    },
    {
      sequelize, modelName: 'users'
    });

    super.init({}, { sequelize, modelName: 'users' });
  }

  static associate(models) {
    this.belongsTo(models.accounts, { foreignKey: 'accountId', as: 'account' });
    this.belongsTo(models.profiles, { foreignKey: 'profileId', as: 'profile' });
  }

  static async listNotification() {
    let where = { canNotify: true },
      attributes = ['name', 'email'];
    return await this.findAll({ attributes, where })
  }
}

export default User;
