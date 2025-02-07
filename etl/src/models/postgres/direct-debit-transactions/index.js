import { Model, DataTypes } from 'sequelize';

class DirectDebitTransactions extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      keyCommon: DataTypes.STRING,
      crdBank: DataTypes.STRING,
      crdBranch: DataTypes.STRING,
      crdAccount: DataTypes.STRING,
      crdAcctDigit: DataTypes.STRING,
      debBank: DataTypes.STRING,
      debBranch: DataTypes.STRING,
      debAccount: DataTypes.STRING,
      debAcctDigit: DataTypes.STRING,
      tag: DataTypes.STRING,
      debitNumber: DataTypes.STRING,
      ourNumber: DataTypes.STRING,
      refDate: DataTypes.STRING,
      dueDate: DataTypes.STRING,
      amount: DataTypes.DECIMAL(13, 2),
      vatNumber: DataTypes.STRING,
      holderName: DataTypes.STRING,
      saleId: DataTypes.STRING,
    },
    {
      sequelize, modelName: 'directDebitTransactions'
    });
    }
}

export default DirectDebitTransactions;
