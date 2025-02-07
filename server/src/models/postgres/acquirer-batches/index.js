import _ from 'lodash'
import { postgres } from 'models'
import sequelize, { Model, DataTypes, Op } from 'sequelize';

const MAP = {
  'venda': { name: 'Captura', conciliation: 'creditcard_capture' },
  'liquidacao': { name: 'Liquidação', conciliation: 'creditcard_settlement' }
}

class AcquirerBatches extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      acquirer: DataTypes.STRING,
      batchGroup: DataTypes.STRING,
      batchSource: DataTypes.STRING,
      group: DataTypes.ENUM(['venda', 'liquidacao', 'saldo']),
      type: DataTypes.ENUM(['venda', 'liquidacao', 'antecipacao', 'cancelamento', 'chargeback', 'aluguel_equipamentos', 'ajuste_a_credito', 'ajuste_a_debito', 'saldo_inicial']),
      plan: DataTypes.ENUM(['avista', 'rotativo', 'parcelado']),
      tag: DataTypes.STRING,
      pointOfSale: DataTypes.STRING,
      batchNo: DataTypes.STRING,
      operationNo: DataTypes.STRING,
      refDate: DataTypes.STRING,
      taxDate: DataTypes.STRING,
      dueDate: DataTypes.STRING,
      payDate: DataTypes.STRING,
      cardBrandCode: DataTypes.STRING,
      cardBrandName: DataTypes.STRING,
      installment: DataTypes.STRING,
      qtyTransactions: DataTypes.INTEGER,
      qtyRejections: DataTypes.INTEGER,
      bankCode: DataTypes.STRING,
      bankBranch: DataTypes.STRING,
      bankAccount: DataTypes.STRING,
      notes: DataTypes.STRING,
      grossAmount: DataTypes.DECIMAL(13, 2),
      rate: DataTypes.DECIMAL(13, 2),
      commission: DataTypes.DECIMAL(13, 2),
      netAmount: DataTypes.DECIMAL(13, 2),
      adjustment: DataTypes.DECIMAL(13, 2),
      fee: DataTypes.DECIMAL(13, 2),
      settlement: DataTypes.DECIMAL(13, 2),
      sourceDb: DataTypes.STRING,
      sourceId: DataTypes.STRING,
      fileName: DataTypes.STRING,
      fileLine: DataTypes.INTEGER,
    },
    {
      sequelize, modelName: 'acquirerBatches'
    });
  }

  static associate(models) {
    this.belongsTo(models.acquirers, { foreignKey: 'acquirer', as: 'acquirerData' });
  }

  static async listDashboard(from, to, tags) {
    let data = [],
      where = {
        refDate: { [Op.gte]: from, [Op.lte]: to },
        group: { [Op.ne]: 'saldo' }
      },
      attributes = ['group',
                    [sequelize.fn('count', sequelize.col('group')), 'count'],
                    [sequelize.fn('sum', sequelize.col('grossAmount')), 'grossAmount'],
                    [sequelize.fn('sum', sequelize.col('commission')), 'commission'],
                    [sequelize.fn('sum', sequelize.col('rejectAmount')), 'rejectAmount'],
                    [sequelize.fn('sum', sequelize.col('settlement')), 'settlement']
      ],
      include = [{
        model: postgres.Acquirers,
        as: 'acquirerData',
        required: true,
        attributes: ['id', 'name']
      }],
      group = ['acquirerBatches.group', 'acquirerData.id', 'acquirerData.name'],
      order = [['acquirerData', 'name', 'ASC'], ['group', 'ASC']];
    if (_.isEmpty(tags) == false) {
      where['tag'] = { [Op.in]: tags };
    }
    const list = await this.findAll({where, attributes, include, group, order, raw: true });
    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        grossAmount = _.toNumber(_.get(row, 'grossAmount') || 0),
        commission = _.toNumber(_.get(row, 'commission') || 0),
        rejectAmount = _.toNumber(_.get(row, 'rejectAmount') || 0),
        settlement = _.toNumber(_.get(row, 'settlement') || 0),
        group = _.get(row, 'group', ''),
        concRule = _.get(MAP[group], 'conciliation') || '',
        amount = _.round(grossAmount + rejectAmount + settlement, 2),
        item = {
          type: '03 - Adquirentes',
          name: _.get(row, 'acquirerData.name', ''),
          group: _.get(MAP[group], 'name') || _.get(row, 'group'),
          count: _.toNumber(_.get(row, 'count', 0)),
          amount: amount,
          conciliation: {
            rule: concRule,
            debit: (concRule == 'creditcard_settlement' ? amount : 0),
            credit: (concRule == 'creditcard_capture' ? amount : 0)
          },
          filterAcquirer: {
            group: group,
            acquirer: _.get(row, 'acquirerData.id', ''),
            startDate: from,
            endDate: to,
            tags
          }
        };
      data.push(item);
      if (group == 'venda') {
        let extra = _.cloneDeep(item),
          factor = (commission > 0 ? -1 : 1);
        extra['group'] = 'Taxa de Administração';
        extra['amount'] = (commission * factor);
        delete extra.filterAcquirer;
        delete extra.conciliation;
        data.push(extra);
      }
    }

    return data;
  };

  static async getCardBrandParams() {
    let attributes = ['cardBrandName',
                    [sequelize.fn('sum', sequelize.col('rejectAmount')), 'rejectAmount'],
                    [sequelize.fn('sum', sequelize.col('settlement')), 'settlement']
      ],
      group = ['acquirerBatches.cardBrandName'],
      order = [['cardBrandName', 'ASC']];
    return { attributes, group, order, raw: true };
  }

  static async getPointOfSaleParams() {
    let attributes = ['pointOfSale', [sequelize.fn('sum', sequelize.col('settlement')), 'settlement'] ],
      group = ['acquirerBatches.pointOfSale'],
      order = [['pointOfSale', 'ASC']];
    return { attributes, group, order, raw: true };
  }

  static async listDashboardDetail(from, to, acquirer, tags) {
    let result = {
        cardBrand: [],
        pointOfSale: [],
        captureType: [],
        terminalNo: []
      },
      where = {
        refDate: { [Op.gte]: from, [Op.lte]: to },
        group: { [Op.eq]: 'liquidacao' },
        acquirer: acquirer
      };
    if (_.isEmpty(tags) == false) {
      where['tag'] = { [Op.in]: tags };
    }
    const cardBrand = await this.findAll({where, ...await this.getCardBrandParams() });
    const pointOfSale = await this.findAll({where, ...await this.getPointOfSaleParams() });

    result.cardBrand = cardBrand.map(o => { return { name: o.cardBrandName, amount: _.round(o.rejectAmount + o.settlement, 2) } })
    result.pointOfSale = pointOfSale.map(o => { return { name: o.pointOfSale, amount: o.settlement } })

    return result;
  }
}

export default AcquirerBatches;
