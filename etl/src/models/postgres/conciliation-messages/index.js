import { Model, DataTypes } from 'sequelize';

class ConciliationMessages extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      sourceName: DataTypes.STRING,
      sourceDb: DataTypes.STRING,
      sourceId: DataTypes.STRING,
      memo: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize, modelName: 'conciliationMessages'
    });
  }

  static associate(models) {
    this.belongsTo(models.conciliations, { foreignKey: 'date', sourceId: 'date', as: 'conciliationData' });
    this.belongsTo(models.messageTypes, { foreignKey: 'messageId', sourceId: 'id', as: 'messageData' });
  }
}

export default ConciliationMessages;

