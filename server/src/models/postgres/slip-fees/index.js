import _ from 'lodash'
import { postgres } from 'models'
import sequelize, { Model, DataTypes, Op } from 'sequelize';

class SlipFees extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      keyCommon: DataTypes.STRING,
      bank: DataTypes.STRING,
      branch: DataTypes.STRING,
      account: DataTypes.STRING,
      digitAccount: DataTypes.STRING,
      tag: DataTypes.STRING,
      date: DataTypes.STRING,
      feeNumber: DataTypes.STRING,
      amount: DataTypes.DECIMAL(13, 2),
      wallet: DataTypes.STRING,
      occurId: DataTypes.STRING,
      occurName: DataTypes.STRING,
      sourceDb: DataTypes.STRING,
      sourceId: DataTypes.STRING,
      fileName: DataTypes.STRING,
      fileLine: DataTypes.INTEGER,
    },
    {
      sequelize, modelName: 'slipFees'
    });
  }

  static associate(models) {
    this.belongsTo(models.banks, { foreignKey: 'bank', as: 'bankData' });
  }

  static async listDashboard(from, to, tags) {
    let where = {
        'date': { [Op.gte]: from, [Op.lte]: to }
      },
      attributes = ['bank', 'occurName',
                    [sequelize.fn('count', sequelize.col('bank')), 'count'],
                    [sequelize.fn('sum', sequelize.col('amount')), 'amount']
      ],
      include = [{
        model: postgres.Banks,
        as: 'bankData',
        required: true,
        attributes: ['name', 'nick']
      }],
      group = ['slipFees.bank', 'slipFees.occurName', 'bankData.name', 'bankData.nick'],
      order = [['bankData', 'nick', 'ASC'], ['occurName', 'ASC']];
    if (_.isEmpty(tags) == false) {
      where['tag'] = { [Op.in]: tags };
    }
    const list = await this.findAll({where, attributes, include, group, order, raw: true });
    const result = _.map(list, row => {
      let type = _.get(row, 'occurrences.type', ''),
        concRule = 'slip_fee',
        amount = _.toNumber(_.get(row, 'amount') || 0),
        item = {
          type: '04 - Boletos',
          name: _.capitalize(_.get(row, 'bankData.nick', '')),
          group: _.capitalize(_.get(row, 'occurName', '')),
          count: _.toNumber(_.get(row, 'count', 0)),
          amount: amount,
          conciliation: {
            rule: concRule,
            debit: 0,
            credit: amount
          }
        };
      return item;
    })

    return result;
  };
}

export default SlipFees;
