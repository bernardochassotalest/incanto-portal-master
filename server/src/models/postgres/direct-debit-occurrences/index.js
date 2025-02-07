import { Model, DataTypes } from 'sequelize';

class DirectDebitOccurrences extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      transactionId: DataTypes.STRING,
      type: DataTypes.ENUM(['none', 'capture', 'settlement', 'cancellation']),
      occurId: DataTypes.STRING,
      occurName: DataTypes.STRING,
      date: DataTypes.STRING,
      amount: DataTypes.DECIMAL(13, 2),
      interest: DataTypes.DECIMAL(13, 2),
      balance: DataTypes.DECIMAL(13, 2),
      sourceDb: DataTypes.STRING,
      sourceId: DataTypes.STRING,
      fileName: DataTypes.STRING,
      fileLine: DataTypes.INTEGER,
      acctContent: DataTypes.JSON,
    },
    {
      sequelize, modelName: 'directDebitOccurrences'
    });
  }

  static associate(models) {
    this.belongsTo(models.directDebitTransactions, { foreignKey: 'transactionId', as: 'debitData' });
  }
}

export default DirectDebitOccurrences;
