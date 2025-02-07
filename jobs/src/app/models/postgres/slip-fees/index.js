import _ from 'lodash';
import { Model, DataTypes, Op } from 'sequelize';

class SlipFees extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      keyCommon: DataTypes.STRING,
      bank: DataTypes.STRING,
      branch: DataTypes.STRING,
      account: DataTypes.STRING,
      digitAccount: DataTypes.STRING,
      tag: DataTypes.STRING,
      date: DataTypes.STRING,
      feeNumber: DataTypes.STRING,
      amount: DataTypes.DECIMAL(13, 2),
      wallet: DataTypes.STRING,
      occurId: DataTypes.STRING,
      occurName: DataTypes.STRING,
      sourceDb: DataTypes.STRING,
      sourceId: DataTypes.STRING,
      fileName: DataTypes.STRING,
      fileLine: DataTypes.INTEGER,
    },
    {
      sequelize, modelName: 'slipFees'
    });
  }
}

export default SlipFees;
