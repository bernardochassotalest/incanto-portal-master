import { Model, DataTypes } from 'sequelize';

class MessageTypes extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      name: DataTypes.STRING,
    },
    {
      sequelize, modelName: 'messageTypes'
    });
  }
}

export default MessageTypes;

