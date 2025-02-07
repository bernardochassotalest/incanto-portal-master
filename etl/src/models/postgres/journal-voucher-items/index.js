import { Model, DataTypes } from 'sequelize';

class JournalVoucherItems extends Model {
  static init(sequelize) {
    super.init({
      jeId: { type: DataTypes.STRING, primaryKey: true },
      lineId: { type: DataTypes.STRING, primaryKey: true },
      visOrder: DataTypes.INTEGER,
      account: DataTypes.STRING,
      shortName: DataTypes.STRING,
      debit: DataTypes.DECIMAL(13, 2),
      credit: DataTypes.DECIMAL(13, 2),
      balance: DataTypes.DECIMAL(13, 2),
      costingCenter: DataTypes.STRING,
      project: DataTypes.STRING,
      memo: DataTypes.STRING,
    },
    {
      sequelize, modelName: 'journalVoucherItems'
    });
  }
}

export default JournalVoucherItems;
