import _ from 'lodash';
import { Model, DataTypes, Op } from 'sequelize';

class SlipOccurrences extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      transactionId: DataTypes.STRING,
      type: DataTypes.ENUM(['none', 'capture', 'settlement', 'cancellation']),
      occurId: DataTypes.STRING,
      occurName: DataTypes.STRING,
      paidPlace: DataTypes.STRING,
      date: DataTypes.STRING,
      amount: DataTypes.DECIMAL(13, 2),
      discount: DataTypes.DECIMAL(13, 2),
      interest: DataTypes.DECIMAL(13, 2),
      balance: DataTypes.DECIMAL(13, 2),
      sourceDb: DataTypes.STRING,
      sourceId: DataTypes.STRING,
      fileName: DataTypes.STRING,
      fileLine: DataTypes.INTEGER,
      acctContent: DataTypes.JSON,
    },
    {
      sequelize, modelName: 'slipOccurrences'
    });
  }

  static associate(models) {
    this.belongsTo(models.slipTransactions, { foreignKey: 'transactionId', as: 'slipData' });
  }
}

export default SlipOccurrences;
