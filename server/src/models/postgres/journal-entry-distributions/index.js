import { Model, DataTypes } from 'sequelize';

class JournalEntryDistributions extends Model {
  static init(sequelize) {
    super.init({
      transId: { type: DataTypes.STRING, primaryKey: true },
      lineId: { type: DataTypes.STRING, primaryKey: true },
      costingCenter: { type: DataTypes.STRING, primaryKey: true },
      profitCode: DataTypes.STRING,
      validFrom: DataTypes.STRING,
      validTo: DataTypes.STRING,
      factor: DataTypes.DECIMAL(12, 10),
      debit: DataTypes.DECIMAL(13, 2),
      credit: DataTypes.DECIMAL(13, 2),
      balance: DataTypes.DECIMAL(13, 2),
    },
    {
      sequelize, modelName: 'journalEntryDistributions'
    });
  }
}

export default JournalEntryDistributions;
