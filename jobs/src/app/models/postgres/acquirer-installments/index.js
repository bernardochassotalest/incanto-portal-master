import { Model, DataTypes } from 'sequelize';
import { postgres } from 'app/models'

class AcquirerInstallments extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      transactionId: DataTypes.STRING,
      installment: DataTypes.STRING,
      dueDate: DataTypes.STRING,
      transType: DataTypes.ENUM(['venda', 'liquidacao', 'antecipacao', 'cancelamento', 'chargeback']),
      grossAmount: DataTypes.DECIMAL(13, 2),
      rate: DataTypes.DECIMAL(13, 2),
      commission: DataTypes.DECIMAL(13, 2),
      netAmount: DataTypes.DECIMAL(13, 2),
      acctContent: DataTypes.JSON,
    },
    {
      sequelize, modelName: 'acquirerInstallments'
    });
  }

  static associate(models) {
    this.belongsTo(models.acquirerTransactions, { foreignKey: 'transactionId', as: 'transData' });
    this.hasMany(models.accountingItems, { foreignKey: 'sourceId', as: 'accountingData' });
  }

  static async listAccounting({refDate}) {
    let attributes = ['id', 'grossAmount', 'acctContent'],
      where = { '$accountingData.id$': null },
      include = [{
        model: postgres.AcquirerTransactions,
        as: 'transData',
        required: true,
        attributes: ['id', 'captureDate'],
        where: { captureDate: refDate },
        include: [{
          model: postgres.Sales,
          as: 'saleData',
          required: false,
          attributes: ['id', 'taxDate', 'isCaptured', 'isPecld']
        }]
      },{
        model: postgres.AccountingItems,
        as: 'accountingData',
        required: false,
        attributes: ['id'],
        where: { 'sourceDb': 'acquirerInstallments' }
      }];
    return await this.findAll({ attributes, where, include })
  }
}
export default AcquirerInstallments;

