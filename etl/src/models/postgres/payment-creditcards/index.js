import { postgres } from '../../../models'
import { Model, DataTypes } from 'sequelize';

class PaymentCreditcards extends Model {
  static init(sequelize) {
    super.init({
      paymentId: { type: DataTypes.STRING, primaryKey: true },
      acquirer: DataTypes.STRING,
      keyCommon: DataTypes.STRING,
      keyNsu: DataTypes.STRING,
      keyTid: DataTypes.STRING,
      pointOfSale: DataTypes.STRING,
      time: DataTypes.STRING,
      tid: DataTypes.STRING,
      nsu: DataTypes.STRING,
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
    this.belongsTo(models.salePayments, { foreignKey: 'paymentId', as: 'paymentData' });
  }

  static async listSaleId(keyNsu) {
    let attributes = ['paymentId'],
      where = { keyNsu },
      include = [{
          model: postgres.SalePayments,
          as: 'paymentData',
          required: true,
          attributes: ['id', 'saleId']
        }];
    return await this.findAll({ attributes, where, include })
  }
}

export default PaymentCreditcards;

