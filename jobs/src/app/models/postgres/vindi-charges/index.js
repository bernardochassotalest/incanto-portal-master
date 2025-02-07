import { Model, DataTypes } from 'sequelize';
import { postgres } from 'app/models';

class VindiCharges extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      billId: DataTypes.STRING,
      status: DataTypes.STRING,
      issuedDate: DataTypes.STRING,
      createDate: DataTypes.STRING,
      dueDate: DataTypes.STRING,
      paidDate: DataTypes.STRING,
      paymentMethod: DataTypes.STRING,
      amount: DataTypes.DECIMAL(13, 2),
      content: DataTypes.JSON,
    },
    {
      sequelize, modelName: 'vindiCharges'
    });
  }

  static associate(models) {
    this.hasMany(models.vindiTransactions, { foreignKey: 'chargeId', sourceKey: 'id', as: 'transactions' });
    this.hasOne(models.sales, { foreignKey: 'sourceId', sourceKey: 'billId', as: 'saleData' });
    this.hasOne(models.salePayments, { foreignKey: 'sourceId', as: 'paymentData' });
  }

  static async getForPayments() {
    const attributes = [
        ['billId', 'billId'],
        ['id', 'chargeId'],
        ['amount', 'amount'],
        ['content', 'payment']
      ],
      include = [{
        association: 'transactions',
        required: true,
        attributes: [ ['id', 'transactionId'], ['content', 'extra'] ],
        include: [{
          model: postgres.SalePayments,
          as: 'paymentData',
          required: false,
          attributes: ['id'],
          where: { 'sourceDb': 'vindiTransactions' }
        }]
      }],
      where = { '$transactions->paymentData.id$': null },
      order = ['billId', 'id', ['transactions', 'id', 'ASC']];

    let { rows = [] } = await this.findAndCountAll({ attributes, include, where, order, raw: true });
    return rows
  }
}

export default VindiCharges;
