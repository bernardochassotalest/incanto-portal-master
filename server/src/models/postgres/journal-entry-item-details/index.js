import { Model, DataTypes } from 'sequelize';

class JournalEntryItemDetails extends Model {
  static init(sequelize) {
    super.init({
      transId: { type: DataTypes.STRING, primaryKey: true },
      lineId: { type: DataTypes.STRING, primaryKey: true },
      docEntry: { type: DataTypes.STRING, primaryKey: true },
      lineNum: { type: DataTypes.STRING, primaryKey: true },
      itemCode: DataTypes.STRING,
      description: DataTypes.STRING,
      memo: DataTypes.STRING,
      lineTotal: DataTypes.DECIMAL(13, 2),
    },
    {
      sequelize, modelName: 'journalEntryItemDetails'
    });
  }
}

export default JournalEntryItemDetails;
