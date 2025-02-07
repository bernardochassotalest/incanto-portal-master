import _ from 'lodash';
import { postgres } from 'app/models'
import { Model, DataTypes, Op } from 'sequelize';
import accountingConfig from 'config/accounting';

class SlipOccurrences extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      transactionId: DataTypes.STRING,
      type: DataTypes.ENUM(['none', 'capture', 'settlement', 'cancellation']),
      occurId: DataTypes.STRING,
      occurName: DataTypes.STRING,
      paidPlace: DataTypes.STRING,
      date: DataTypes.STRING,
      amount: DataTypes.DECIMAL(13, 2),
      discount: DataTypes.DECIMAL(13, 2),
      interest: DataTypes.DECIMAL(13, 2),
      balance: DataTypes.DECIMAL(13, 2),
      sourceDb: DataTypes.STRING,
      sourceId: DataTypes.STRING,
      fileName: DataTypes.STRING,
      fileLine: DataTypes.INTEGER,
      acctContent: DataTypes.JSON,
    },
    {
      sequelize, modelName: 'slipOccurrences'
    });
  }

  static associate(models) {
    this.belongsTo(models.slipTransactions, { foreignKey: 'transactionId', as: 'slipData' });
    this.hasMany(models.accountingItems, { foreignKey: 'sourceId', as: 'accountingData' });
  }

  static async listAcctCaptureCancellation({refDate}) {
    let attributes = ['id', 'type', 'acctContent'],
      where = {
          date: refDate,
          type: { [Op.in]: ['capture', 'cancellation'] },
          '$accountingData.id$': null
      },
      include = [{
        model: postgres.SlipTransactions,
        as: 'slipData',
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
        where: { 'sourceDb': 'slipOccurrences' }
      }];
    return await this.findAll({ attributes, where, include })
  }

  static async listAcctSettlement({refDate}) {
    let attributes = ['id', 'type', 'acctContent'],
      where = {
          date: refDate,
          type: 'settlement',
          '$accountingData.id$': null
      },
      include = [{
        model: postgres.SlipTransactions,
        as: 'slipData',
        required: true,
        attributes: ['id', 'refDate'],
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
        where: { 'sourceDb': 'slipOccurrences' }
      }];
    return await this.findAll({ attributes, where, include })
  }

  static async listAccounting({refDate}) {
    let result = [];

    result = _.concat(result, await this.listAcctCaptureCancellation({refDate}))
    result = _.concat(result, await this.listAcctSettlement({refDate}))

    return result;
  }
}

export default SlipOccurrences;
