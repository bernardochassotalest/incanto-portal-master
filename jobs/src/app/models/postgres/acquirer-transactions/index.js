import { Model, DataTypes, Op } from 'sequelize';
import { postgres } from 'app/models'

class AcquirerTransactions extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      acquirer: DataTypes.STRING,
      batchGroup: DataTypes.STRING,
      keyNsu: DataTypes.STRING,
      keyTid: DataTypes.STRING,
      tag: DataTypes.STRING,
      pointOfSale: DataTypes.STRING,
      batchNo: DataTypes.STRING,
      saleType: DataTypes.ENUM(['debito', 'credito']),
      captureDate: DataTypes.STRING,
      captureTime: DataTypes.STRING,
      grossAmount: DataTypes.DECIMAL(13, 2),
      rate: DataTypes.DECIMAL(13, 2),
      commission: DataTypes.DECIMAL(13, 2),
      netAmount: DataTypes.DECIMAL(13, 2),
      nsu: DataTypes.STRING,
      authorization: DataTypes.STRING,
      tid: DataTypes.STRING,
      reference: DataTypes.STRING,
      cardNumber: DataTypes.STRING,
      cardBrandCode: DataTypes.STRING,
      cardBrandName: DataTypes.STRING,
      captureType: DataTypes.STRING,
      terminalNo: DataTypes.STRING,
      sourceDb: DataTypes.STRING,
      sourceId: DataTypes.STRING,
      fileName: DataTypes.STRING,
      fileLine: DataTypes.INTEGER,
      saleId: DataTypes.STRING,
    },
    {
      sequelize, modelName: 'acquirerTransactions'
    });
  }

  static associate(models) {
    this.hasMany(models.acquirerInstallments, { foreignKey: 'transactionId', sourceKey: 'id', as: 'installments' });
    this.hasOne(models.paymentCreditcards, { foreignKey: 'keyNsu', sourceKey: 'keyNsu', as: 'creditcardData' });
    this.hasOne(models.sales, { foreignKey: 'id', sourceKey: 'saleId', as: 'saleData' });
  }

  static async listSaleId({refDate}) {
    let attributes = ['id'],
      where = { captureDate: refDate, saleId: '' },
      include = [{
        model: postgres.PaymentCreditcards,
        as: 'creditcardData',
        required: true,
        attributes: ['keyNsu'],
        include: [{
          model: postgres.SalePayments,
          as: 'paymentData',
          required: true,
          attributes: ['id', 'saleId']
        }]
      }];
    return await this.findAll({ attributes, where, include })
  }

  static async listByBatchGroup(batchGroup) {
    let attributes = ['id', 'keyNsu', 'saleId', 'batchGroup', 'netAmount'],
      where = {
        batchGroup: { [Op.in]: batchGroup }
      },
      include = [{
        model: postgres.AcquirerInstallments,
        as: 'installments',
        required: true,
        attributes: ['installment', 'dueDate', 'commission', 'netAmount']
      }];
    return await this.findAll({ attributes, where, include });
  }

  static async listByKeyNsu(keyNsu) {
    let attributes = ['id', 'keyNsu', 'saleId', 'batchGroup', 'netAmount'],
      where = {
        keyNsu: { [Op.in]: keyNsu }
      };
    return await this.findAll({ attributes, where });
  }
}
export default AcquirerTransactions;

