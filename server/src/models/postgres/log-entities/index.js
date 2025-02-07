import { Model, DataTypes } from 'sequelize';

class LogEntities extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      timeLog: DataTypes.STRING,
      sourceDb: DataTypes.STRING,
      sourceId: DataTypes.STRING,
      action: DataTypes.ENUM(['none', 'insert', 'update', 'delete']),
      beforeData: DataTypes.JSON,
      afterData: DataTypes.JSON,
    },
    {
      sequelize, modelName: 'logEntities'
    });
  }

  static associate(models) {
    this.belongsTo(models.users, { foreignKey: 'userId', as: 'userData' });
  };
}

export default LogEntities;
