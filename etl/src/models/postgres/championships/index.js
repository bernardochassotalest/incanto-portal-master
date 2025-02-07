import { Model, DataTypes } from 'sequelize';

class Championships extends Model {
  static init(sequelize) {
    super.init({
        id: { type: DataTypes.STRING, primaryKey: true },
        name: DataTypes.STRING,
    },
    {
        sequelize, modelName: 'championships'
    });
  }
}

export default Championships;