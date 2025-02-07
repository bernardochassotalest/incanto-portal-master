import { Model, DataTypes } from 'sequelize';

class SapB1Users extends Model {
  static init(sequelize) {
    super.init({
        id: { type: DataTypes.STRING, primaryKey: true },
        name: DataTypes.STRING,
    },
    {
        sequelize, modelName: 'sapB1Users'
    });
  }
}

export default SapB1Users;
