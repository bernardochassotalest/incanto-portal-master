import _ from 'lodash';
import { postgres } from 'app/models'
import { Model, DataTypes, Op } from 'sequelize';

class AcquirerSettlements extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      installment: DataTypes.STRING,
      transType: DataTypes.ENUM(['liquidacao', 'antecipacao', 'taxa_administracao', 'taxa_antecipacao', 'cancelamento', 'chargeback', 'ajuste_a_debito', 'ajuste_a_credito']),
      dueDate: DataTypes.STRING,
      paidDate: DataTypes.STRING,
      amount: DataTypes.DECIMAL(13, 2),
      notes: DataTypes.STRING,
      fileName: DataTypes.STRING,
      fileLine: DataTypes.INTEGER,
      accountingItemId: DataTypes.STRING,
      saleAccountingId: DataTypes.STRING,
    },
    {
      sequelize, modelName: 'acquirerSettlements'
    });
  };

  static associate(models) {
    this.belongsTo(models.acquirerTransactions, { foreignKey: 'transactionId', as: 'trsn' });
    this.hasOne(models.accountingItems, { foreignKey: 'id', sourceKey: 'accountingItemId', as: 'acctData' });
    this.hasOne(models.saleAccountings, { foreignKey: 'id', sourceKey: 'saleAccountingId', as: 'saleAcct' });
  };

  static async listSaleId() {
    let attributes = ['id', 'transactionId', 'installment', 'transType', 'dueDate', 'paidDate', 'amount',
                      'notes', 'fileName', 'fileLine', 'accountingItemId'],
      where = {
        saleAccountingId: '',
        accountingItemId: { [Op.ne]: '' },
      },
      include = [{
        model: postgres.AcquirerTransactions,
        as: 'trsn',
        required: true,
        attributes: ['saleId'],
        where: {
          saleId: { [Op.ne]: '' }
        }
      }],
      list = await this.findAll({ attributes, where, include, raw: true });

    const result = list.map((o) => {
      let item = {
          id: _.get(o, 'id', ''),
          transactionId: _.get(o, 'transactionId', ''),
          installment: _.get(o, 'installment', ''),
          transType: _.get(o, 'transType', ''),
          dueDate: _.get(o, 'dueDate', ''),
          paidDate: _.get(o, 'paidDate', ''),
          amount: _.get(o, 'amount', 0),
          notes: _.get(o, 'notes', ''),
          fileName: _.get(o, 'fileName', ''),
          fileLine: _.get(o, 'fileLine', ''),
          accountingItemId: _.get(o, 'accountingItemId', ''),
          saleId: _.get(o, 'trsn.saleId', '')
        }
      return item;
    });
    return result;
  }
}

export default AcquirerSettlements;
