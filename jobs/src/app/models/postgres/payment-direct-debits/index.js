import { Model, DataTypes } from 'sequelize';

class PaymentDirectDebits extends Model {
  static init(sequelize) {
    super.init({
      paymentId: { type: DataTypes.STRING, primaryKey: true },
      keyCommon: DataTypes.STRING,
      bank: DataTypes.STRING,
      branch: DataTypes.STRING,
      account: DataTypes.STRING,
      debitNumber: DataTypes.STRING,
      vatNumber: DataTypes.STRING,
      holderName: DataTypes.STRING,
    },
    {
      sequelize, modelName: 'paymentDirectDebits'
    });
  }

  static associate(models) {
    this.belongsTo(models.salePayments, { foreignKey: 'paymentId', as: 'paymentData' });
  }
}

export default PaymentDirectDebits;
