import _ from 'lodash'
import { postgres } from 'models'
import sequelize, { Model, DataTypes, Op } from 'sequelize';

const MAP = {
  'capture': { rule: 'slip_capture', amount: 'credit' },
  'settlement': { rule: 'slip_settlement', amount: 'debit' },
  // 'cancellation': { rule: 'slip_canceled', amount: 'credit' } //TODO: Possibilidade de lado único
}

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
    this.belongsTo(models.banks, { foreignKey: 'bank', as: 'bankData' });
    this.hasMany(models.slipOccurrences, { foreignKey: 'transactionId', sourceKey: 'id', as: 'occurrences' });
  }

  static async listDashboard(from, to, tags) {
    let where = {
        '$occurrences.type$': { [Op.ne]: 'none' },
        '$occurrences.date$': { [Op.gte]: from, [Op.lte]: to }
      },
      attributes = ['bank',
                    [sequelize.fn('count', sequelize.col('bank')), 'count'],
                    [sequelize.fn('sum', sequelize.col('occurrences.amount')), 'amount']
      ],
      include = [{
        model: postgres.SlipOccurrences,
        as: 'occurrences',
        required: true,
        attributes: ['type', 'occurName']
      },{
        model: postgres.Banks,
        as: 'bankData',
        required: true,
        attributes: ['name', 'nick']
      }],
      group = ['slipTransactions.bank', 'occurrences.type', 'occurrences.occurName', 'bankData.name', 'bankData.nick'],
      order = [['bankData', 'nick', 'ASC'], ['occurrences', 'occurName', 'ASC']];
    if (_.isEmpty(tags) == false) {
      where['tag'] = { [Op.in]: tags };
    }
    const list = await this.findAll({where, attributes, include, group, order, raw: true });
    const result = _.map(list, row => {
      let type = _.get(row, 'occurrences.type', ''),
        concRule = MAP[type] || '',
        amount = _.toNumber(_.get(row, 'amount') || 0),
        item = {
          type: '04 - Boletos',
          name: _.capitalize(_.get(row, 'bankData.nick', '')),
          group: _.capitalize(_.get(row, 'occurrences.occurName', '')),
          count: _.toNumber(_.get(row, 'count', 0)),
          amount: amount,
          conciliation: {
            rule: _.get(concRule, 'rule', ''),
            debit: (_.get(concRule, 'amount', '') == 'debit' ? amount : 0),
            credit: (_.get(concRule, 'amount', '') == 'credit' ? amount : 0)
          }
        };
      return item;
    })

    return result;
  };
}

export default SlipTransactions;
