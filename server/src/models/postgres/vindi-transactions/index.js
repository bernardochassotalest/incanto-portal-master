import _ from 'lodash';
import { postgres } from 'models'
import sequelize, { Model, DataTypes, Op } from 'sequelize';

const vindiBillUrl = process.env.VINDI_BILL_URL;
const MAP = {
    'credit_card-success': { name: 'Cartão - Captura', conciliation: 'creditcard_capture' },
    'online_bank_slip-canceled': { name: 'Boleto - Cancelamento', conciliation: '' },
    'online_bank_slip-success': { name: 'Boleto - Captura', conciliation: 'slip_capture' },
    'online_bank_slip-waiting': { name: 'Boleto - Aguardando', conciliation: '' },
    'online_bank_slip_-canceled': { name: 'Boleto(WS) - Cancelamento', conciliation: '' },
    'online_bank_slip_-success': { name: 'Boleto(WS) - Captura', conciliation: 'slip_capture' },
    'online_bank_slip_-waiting': { name: 'Boleto(WS) - Aguardando', conciliation: '' },
    'bank_debit-waiting': { name: 'Débito - Aguardando', conciliation: '' },
    'bank_debit-success': { name: 'Débito - Captura', conciliation: 'direct_debit_capture' },
    'bank_debit-canceled': { name: 'Débito - Cancelamento', conciliation: '' },
    'cash-success': { name: 'Quitação', conciliation: '' },
    'cash_q-success': { name: 'Quitação', conciliation: '' },
  };

class VindiTransactions extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      chargeId: DataTypes.STRING,
      transactionType: DataTypes.STRING,
      status: DataTypes.STRING,
      createDate: DataTypes.STRING,
      dueDate: DataTypes.STRING,
      paidDate: DataTypes.STRING,
      paymentMethod: DataTypes.STRING,
      authorization: DataTypes.STRING,
      tid: DataTypes.STRING,
      nsu: DataTypes.STRING,
      amount: DataTypes.DECIMAL(13, 2),
      content: DataTypes.JSON,
    },
    {
      sequelize, modelName: 'vindiTransactions'
    });
  }

  static associate(models) {
    this.hasOne(models.vindiCharges, { foreignKey: 'id', sourceKey: 'chargeId', as: 'chargeData' });
    this.hasOne(models.salePayments, { foreignKey: 'sourceId', as: 'payData' });
  }

  static async listDashboard(from, to, tags) {
    if (_.includes(tags, 'avanti') == false) {
      return [];
    }
    let data = [],
      where = {
        paidDate: { [Op.gte]: from, [Op.lte]: to }
      },
      attributes = ['paymentMethod', 'status',
                    [sequelize.fn('count', sequelize.col('transactionType')), 'count'],
                    [sequelize.fn('sum', sequelize.col('amount')), 'amount']
      ],
      group = ['vindiTransactions.paymentMethod', 'vindiTransactions.status'],
      order = [['paymentMethod', 'ASC'], ['status', 'ASC']],
      list = await this.findAll({where, attributes, group, order, raw: true });

    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        paymentMethod = _.get(row, 'paymentMethod', ''),
        status = _.get(row, 'status', ''),
        group = `${paymentMethod}-${status}`,
        item = {
          type: '02 - Pagamentos',
          name: 'Vindi',
          group: _.get(MAP[group], 'name') || group,
          count: _.toNumber(_.get(row, 'count', 0)),
          amount: _.toNumber(_.get(row, 'amount') || 0),
          conciliation: {
            rule: _.get(MAP[group], 'conciliation') || '',
            debit: _.toNumber(_.get(row, 'amount') || 0),
            credit: 0
          },
          filterVindi: {
            paymentMethod: paymentMethod,
            status: status,
            startDate: from,
            endDate: to,
            tags
          }
        };
      data.push(item);
    }

    return data;
  };

  static async listDashboardDetail(paymentMethod, status, startDate, endDate, tags, offset) {
    let limit = PAGE_SIZE,
      where = {
        paymentMethod, status,
        paidDate: { [Op.gte]: startDate, [Op.lte]: endDate }
      },
      attributes = [['id', 'transactionId'], 'amount'],
      include = [{
        model: postgres.VindiCharges,
        as: 'chargeData',
        required: true,
        attributes: [['id', 'chargeId'], 'billId'],
        include: [{
          model: postgres.Sale,
          as: 'saleData',
          required: true,
          attributes: ['id', 'taxDate', 'status'],
          include: [{
            model: postgres.Customer,
            as: 'customer',
            required: true,
            attributes: ['vatNumber', 'name']
          }]
        }]
      }],
      order = [
        ['chargeData', 'saleData', 'customer', 'name', 'ASC'],
        ['chargeData', 'saleData', 'sourceId', 'ASC'],
      ];

    offset = isNaN(offset) ? 0 : offset * 1;

    let { count = 0, rows = [] } = await this.findAndCountAll({where, attributes, include, order, offset, limit, raw:true });
    const data = rows.map((o) => {
      let billId = _.get(o, 'chargeData.billId') || '',
        row = {
          id: _.get(o, 'chargeData.saleData.id', ''),
          billId: billId,
          chargeId: _.get(o, 'chargeData.chargeId', ''),
          transactionId: _.get(o, 'transactionId', ''),
          status: _.get(o, 'chargeData.saleData.status', ''),
          taxDate: _.get(o, 'chargeData.saleData.taxDate', ''),
          vatNumber: _.get(o, 'chargeData.saleData.customer.vatNumber', ''),
          name: _.get(o, 'chargeData.saleData.customer.name', ''),
          amount: _.get(o, 'amount', 0),
          url: ((_.isEmpty(billId) == false) ? `${vindiBillUrl}/${billId}` : '')
        };
      return row;
    })

    return { rows: data, offset, count, limit };
  };
}

export default VindiTransactions;
