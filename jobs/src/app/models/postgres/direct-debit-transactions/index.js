import { postgres } from 'app/models'
import { getMoreDays } from 'app/lib/utils';
import { Model, DataTypes, Op } from 'sequelize';

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

  static associate(models) {
    this.hasMany(models.directDebitOccurrences, { foreignKey: 'transactionId', sourceKey: 'id', as: 'occurrences' });
    this.hasOne(models.paymentDirectDebits, { foreignKey: 'keyCommon', sourceKey: 'keyCommon', as: 'debitData' });
    this.hasOne(models.sales, { foreignKey: 'id', sourceKey: 'saleId', as: 'saleData' });
  }

  static async listSaleId({refDate}) {
    let attributes = ['id'],
      where = { saleId: '' },
      include = [{
        model: postgres.DirectDebitOccurrences,
        as: 'occurrences',
        required: true,
        attributes: ['id'],
        where: {
          date: {
            [Op.gte]: refDate,
            [Op.lte]: getMoreDays(refDate, 5)
          }
        }
      },{
        model: postgres.PaymentDirectDebits,
        as: 'debitData',
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

export default DirectDebitTransactions;
