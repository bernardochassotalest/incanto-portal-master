import { Model, DataTypes } from 'sequelize';

class JournalEntries extends Model {
  static init(sequelize) {
    super.init({
      transId: { type: DataTypes.STRING, primaryKey: true },
      transType: DataTypes.STRING,
      refDate: DataTypes.STRING,
      taxDate: DataTypes.STRING,
      dueDate: DataTypes.STRING,
      locTotal: DataTypes.DECIMAL(13, 2),
      tag: DataTypes.STRING,
      memo: DataTypes.STRING,
      ref1: DataTypes.STRING,
      ref2: DataTypes.STRING,
      ref3: DataTypes.STRING,
      projectId: DataTypes.STRING,
      pointOfSale: DataTypes.STRING,
      championshipId: DataTypes.STRING,
      matchId: DataTypes.STRING,
      reversed: DataTypes.STRING,
      userId: DataTypes.STRING,
    },
    {
      sequelize, modelName: 'journalEntries'
    });
  }
}

export default JournalEntries;
