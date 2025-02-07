import { Model, DataTypes } from 'sequelize';

class PaymentSlips extends Model {
  static init(sequelize) {
    super.init({
      paymentId: { type: DataTypes.STRING, primaryKey: true },
      bank: DataTypes.STRING,
      keyCommon: DataTypes.STRING,
      barCode: DataTypes.STRING,
      slipNumber: DataTypes.DECIMAL(13, 2),
      ourNumber: DataTypes.DECIMAL(13, 2),
    },
    {
      sequelize, modelName: 'paymentSlips'
    });
  }

  static associate(models) {
    this.belongsTo(models.salePayments, { foreignKey: 'paymentId', as: 'paymentData' });
  }
}

export default PaymentSlips;
