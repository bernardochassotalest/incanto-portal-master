import { Model, DataTypes } from 'sequelize';

class Profile extends Model {
  static init(sequelize) {
    super.init(
      {
        active: DataTypes.BOOLEAN,
        name: DataTypes.STRING,
        permissions: DataTypes.STRING,
        tags: DataTypes.JSONB
      },
      {
        sequelize,
        modelName: 'profiles',
      }
    );
  };

  static associate(models) {
    this.belongsTo(models.accounts, { foreignKey: 'accountId', as: 'account' });
  }
}

export default Profile;
