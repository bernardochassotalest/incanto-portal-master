import { Model, DataTypes } from 'sequelize';

class ChartOfAccount extends Model {
  static init(sequelize) {
    super.init({
        acctCode: { type: DataTypes.STRING, primaryKey: true },
        acctName: DataTypes.STRING,
        accountType: DataTypes.STRING,
        titleAccount: DataTypes.BOOLEAN,
        lockManual: DataTypes.BOOLEAN,
        level: DataTypes.INTEGER,
        group: DataTypes.INTEGER,
        grpLine: DataTypes.INTEGER,
        lastDate: DataTypes.STRING,
    }, { sequelize, modelName: 'chartOfAccounts' });
  }
}

export default ChartOfAccount;
