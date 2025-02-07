import _ from 'lodash';
import sequelize, { Model, DataTypes, Op } from 'sequelize';

class MulticlubesPayments extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      paymentId: DataTypes.STRING,
      itemPaymentId: DataTypes.STRING,
      titleId: DataTypes.STRING,
      titleNumber: DataTypes.STRING,
      memberVatNumber: DataTypes.STRING,
      memberName: DataTypes.STRING,
      type: DataTypes.STRING,
      mode: DataTypes.STRING,
      paidDate: DataTypes.STRING,
      paidAmount: DataTypes.DECIMAL(13, 2),
      dunInstitution: DataTypes.STRING,
      dunBranch: DataTypes.STRING,
      dunAccount: DataTypes.STRING,
      dunDueDate: DataTypes.STRING,
      dunOurNumber: DataTypes.STRING,
      dunReturnFile: DataTypes.STRING,
      tefInstitution: DataTypes.STRING,
      tefCardType: DataTypes.STRING,
      tefDate: DataTypes.STRING,
      tefTime: DataTypes.STRING,
      tefNsu: DataTypes.STRING,
      tefAuthNumber: DataTypes.STRING,
      tefTid: DataTypes.STRING,
      tefCardNumber: DataTypes.STRING,
      tefParcelType: DataTypes.STRING,
      tefParcelQty: DataTypes.STRING,
      tefHolderName: DataTypes.STRING,
      checkInstitution: DataTypes.STRING,
      checkDueDate: DataTypes.STRING,
      checkNumber: DataTypes.STRING,
      checkOwner: DataTypes.STRING,
    },
    {
      sequelize, modelName: 'multiclubesPayments'
    });
  }

  static async listDashboard(from, to, tags) {
    if (_.includes(tags, 'multiclubes') == false) {
      return [];
    }
    let data = [],
      where = {
        tefDate: { [Op.gte]: from, [Op.lte]: to }
      },
      attributes = ['tefInstitution',
                    [sequelize.fn('count', sequelize.col('tefInstitution')), 'count'],
                    [sequelize.fn('sum', sequelize.col('paidAmount')), 'amount']
      ],
      group = ['multiclubesPayments.tefInstitution'],
      order = [['tefInstitution', 'ASC']],
      list = await this.findAll({where, attributes, group, order, raw: true });

    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        item = {
          type: '02 - Pagamentos',
          name: 'Multiclubes',
          group: _.capitalize(_.get(row, 'tefInstitution', '')),
          count: _.toNumber(_.get(row, 'count', 0)),
          amount: _.toNumber(_.get(row, 'amount') || 0),
          conciliation: {
            rule: 'creditcard_capture',
            debit: _.toNumber(_.get(row, 'amount') || 0),
            credit: 0
          }
        };
      data.push(item);
    }

    return data;
  };
}

export default MulticlubesPayments;
