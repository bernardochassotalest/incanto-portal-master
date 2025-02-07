import _ from 'lodash';
import { getMoreDays } from 'app/lib/utils';
import { postgres } from 'app/models';
import { Model, DataTypes, Op } from 'sequelize';
import accountingConfig from 'config/accounting';

class DirectDebitOccurrences extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      transactionId: DataTypes.STRING,
      type: DataTypes.ENUM(['none', 'capture', 'settlement', 'cancellation']),
      occurId: DataTypes.STRING,
      occurName: DataTypes.STRING,
      date: DataTypes.STRING,
      amount: DataTypes.DECIMAL(13, 2),
      interest: DataTypes.DECIMAL(13, 2),
      balance: DataTypes.DECIMAL(13, 2),
      sourceDb: DataTypes.STRING,
      sourceId: DataTypes.STRING,
      fileName: DataTypes.STRING,
      fileLine: DataTypes.INTEGER,
      acctContent: DataTypes.JSON,
    },
    {
      sequelize, modelName: 'directDebitOccurrences'
    });
  }

  static associate(models) {
    this.belongsTo(models.directDebitTransactions, { foreignKey: 'transactionId', as: 'debitData' });
    this.hasMany(models.accountingItems, { foreignKey: 'sourceId', as: 'accountingData' });
  }

  static async listAccounting({refDate}) {
    let attributes = ['id', 'type', 'acctContent'],
      where = {
          date: {
            [Op.gte]: refDate,
            [Op.lte]: getMoreDays(refDate, 5)
          },
          type: { [Op.in]: ['capture', 'settlement'] },
          '$accountingData.id$': null
      },
      include = [{
        model: postgres.DirectDebitTransactions,
        as: 'debitData',
        required: true,
        attributes: ['id', 'refDate'],
        where: {
          refDate: { [Op.gte]: accountingConfig.startDate },
          tag: 'avanti'  //TODO: Retirar bloqueio para o Multiclubes
        },
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
        where: { 'sourceDb': 'directDebitOccurrences' }
      }];
    return await this.findAll({ attributes, where, include })
  }
}

export default DirectDebitOccurrences;
