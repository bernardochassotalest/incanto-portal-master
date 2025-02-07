import { Model, DataTypes } from 'sequelize';

class PaymentCreditcard extends Model {
  static init(sequelize) {
    super.init({
      paymentId: { type: DataTypes.STRING, primaryKey: true },
      acquirer: DataTypes.STRING,
      keyCommon: DataTypes.STRING,
      keyTid: DataTypes.STRING,
      pointOfSale: DataTypes.STRING,
      time: DataTypes.STRING,
      tid: DataTypes.STRING,
      nsu: DataTypes.STRING,
      keyNsu: DataTypes.STRING,
      authorization: DataTypes.STRING,
      cardNumber: DataTypes.STRING,
      cardBrand: DataTypes.STRING,
      holderName: DataTypes.STRING,
    },
    {
      sequelize, modelName: 'paymentCreditcards'
    });
  }

  static associate(models) {
    this.belongsTo(models.salePayments, { foreignKey: 'paymentId', as: 'salePayment' });
  };
}

export default PaymentCreditcard;

