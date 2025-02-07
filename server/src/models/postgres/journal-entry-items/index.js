import { Model, DataTypes } from 'sequelize';

class JournalEntryItems extends Model {
  static init(sequelize) {
    super.init({
      transId: { type: DataTypes.STRING, primaryKey: true },
      lineId: { type: DataTypes.STRING, primaryKey: true },
      visOrder: DataTypes.INTEGER,
      account: DataTypes.STRING,
      shortName: DataTypes.STRING,
      dueDate: DataTypes.STRING,
      debit: DataTypes.DECIMAL(13, 2),
      credit: DataTypes.DECIMAL(13, 2),
      balance: DataTypes.DECIMAL(13, 2),
      balDueDeb: DataTypes.DECIMAL(13, 2),
      balDueCred: DataTypes.DECIMAL(13, 2),
      extrMatch: DataTypes.INTEGER,
      project: DataTypes.STRING,
      contraAct: DataTypes.STRING,
      memo: DataTypes.STRING,
    },
    {
      sequelize, modelName: 'journalEntryItems'
    });
  }

  static associate(models) {
    this.belongsTo(models.journalEntries, { foreignKey: 'transId', as: 'journalEntries' });
    this.hasOne(models.conciliationAccounts, { foreignKey: 'acctCode', sourceKey: 'account', as: 'acctConc' });
  };

}

export default JournalEntryItems;
