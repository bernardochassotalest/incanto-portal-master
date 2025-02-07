import _ from 'lodash'
import { postgres } from 'models'
import sequelize, { Model, DataTypes, Op } from 'sequelize';

const MAP = {
  'creditcard': { name: 'Cartão de Crédito', conciliation: 'creditcard_settlement' },
  'slip': { name: 'Cobrança Bancária', conciliation: 'slip_settlement' },
  'slipFee': { name: 'Tarifa de Boletos', conciliation: 'slip_fee' },
  'directDebit': { name: 'Débito Automático', conciliation: 'direct_debit_settlement' }
}

class BankStatements extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      bank: DataTypes.STRING,
      branch: DataTypes.STRING,
      account: DataTypes.STRING,
      digitAccount: DataTypes.STRING,
      date: DataTypes.STRING,
      debit: DataTypes.DECIMAL(13, 2),
      credit: DataTypes.DECIMAL(13, 2),
      balance: DataTypes.DECIMAL(13, 2),
      category: DataTypes.STRING,
      cashFlow: DataTypes.STRING,
      notes: DataTypes.STRING,
      acquirer: DataTypes.STRING,
      pointOfSale: DataTypes.STRING,
      keyCommon: DataTypes.STRING,
      conciliationType: DataTypes.ENUM(['none', 'creditcard', 'slip', 'directDebit']),
      sourceDb: DataTypes.STRING,
      sourceId: DataTypes.STRING,
      fileName: DataTypes.STRING,
      fileLine: DataTypes.INTEGER,
    },
    {
      sequelize, modelName: 'bankStatements'
    });
  }

  static associate(models) {
    this.belongsTo(models.banks, { foreignKey: 'bank', as: 'bankData' });
  }

  static async listDashboard(from, to) {
    let where = {
        date: { [Op.gte]: from, [Op.lte]: to }
      },
      attributes = ['conciliationType',
                    [sequelize.fn('count', sequelize.col('conciliationType')), 'count'],
                    [sequelize.fn('sum', sequelize.col('balance')), 'amount']
      ],
      include = [{
        model: postgres.Banks,
        as: 'bankData',
        required: true,
        attributes: ['name', 'nick']
      }],
      group = ['bankStatements.conciliationType', 'bankData.name', 'bankData.nick'],
      order = [['bankData', 'nick', 'ASC'], ['conciliationType', 'ASC']],
      list = await this.findAll({where, attributes, include, group, order, raw: true });

    const result = _.map(list, row => {
      let amount = _.toNumber(_.get(row, 'amount') || 0),
        conciliationType = _.get(row, 'conciliationType'),
        concRule = _.get(MAP[conciliationType], 'conciliation') || '',
        item = {
          type: '05 - Extrato Bancário',
          name: _.capitalize(_.get(row, 'bankData.nick', '')),
          group: _.get(MAP[conciliationType], 'name') || _.get(row, 'conciliationType', ''),
          count: _.toNumber(_.get(row, 'count', 0)),
          amount: amount,
          conciliation: {
            rule: concRule,
            debit: (amount < 0 ? (-1 * amount) : 0),
            credit: (amount > 0 ? amount: 0)
          }
        };
      return item;
    })

    return result;
  };
}
export default BankStatements;
