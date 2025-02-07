import { Model, DataTypes } from 'sequelize';
import { postgres } from 'app/models'

class SlipTransactions extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      bank: DataTypes.STRING,
      keyCommon: DataTypes.STRING,
      branch: DataTypes.STRING,
      account: DataTypes.STRING,
      digitAccount: DataTypes.STRING,
      tag: DataTypes.STRING,
      slipNumber: DataTypes.STRING,
      ourNumber: DataTypes.STRING,
      digitOurNumber: DataTypes.STRING,
      reference: DataTypes.STRING,
      wallet: DataTypes.STRING,
      kind: DataTypes.STRING,
      refDate: DataTypes.STRING,
      dueDate: DataTypes.STRING,
      amount: DataTypes.DECIMAL(13, 2),
      holderName: DataTypes.STRING,
      saleId: DataTypes.STRING,
    },
    {
      sequelize, modelName: 'slipTransactions'
    });
  }

  static associate(models) {
    this.hasMany(models.slipOccurrences, { foreignKey: 'transactionId', sourceKey: 'id', as: 'occurrences' });
    this.hasOne(models.paymentSlips, { foreignKey: 'keyCommon', sourceKey: 'keyCommon', as: 'slipData' });
    this.hasOne(models.sales, { foreignKey: 'id', sourceKey: 'saleId', as: 'saleData' });
    this.hasOne(models.banks, { foreignKey: 'id', sourceKey: 'bank', as: 'bankData' });
  }

  static async listSaleId({refDate}) {
    let attributes = ['id'],
      where = { saleId: '' },
      include = [{
        model: postgres.SlipOccurrences,
        as: 'occurrences',
        required: true,
        attributes: ['id'],
        where: { date: refDate }
      },{
        model: postgres.PaymentSlips,
        as: 'slipData',
        required: true,
        attributes: ['keyCommon'],
        include: [{
          model: postgres.SalePayments,
          as: 'paymentData',
          required: true,
          attributes: ['id', 'saleId']
        }]
      }];
    return await this.findAll({ attributes, where, include })
  }
}

export default SlipTransactions;
