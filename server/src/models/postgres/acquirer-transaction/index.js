import _ from 'lodash'
import { postgres } from 'models'
import sequelize, { Model, DataTypes, Op } from 'sequelize';

class AcquirerTransaction extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      acquirer: DataTypes.STRING,
      batchGroup: DataTypes.STRING,
      keyTid: DataTypes.STRING,
      tag: DataTypes.STRING,
      pointOfSale: DataTypes.STRING,
      batchNo: DataTypes.STRING,
      saleType: DataTypes.ENUM(['debito', 'credito']),
      saleDate: DataTypes.STRING,
      captureDate: DataTypes.STRING,
      captureTime: DataTypes.STRING,
      grossAmount: DataTypes.DECIMAL(13, 2),
      rate: DataTypes.DECIMAL(13, 2),
      commission: DataTypes.DECIMAL(13, 2),
      netAmount: DataTypes.DECIMAL(13, 2),
      nsu: DataTypes.STRING,
      authorization: DataTypes.STRING,
      tid: DataTypes.STRING,
      reference: DataTypes.STRING,
      cardNumber: DataTypes.STRING,
      cardBrandCode: DataTypes.STRING,
      cardBrandName: DataTypes.STRING,
      captureType: DataTypes.STRING,
      terminalNo: DataTypes.STRING,
      sourceDb: DataTypes.STRING,
      sourceId: DataTypes.STRING,
      fileName: DataTypes.STRING,
      fileLine: DataTypes.INTEGER,
    },
    {
      sequelize, modelName: 'acquirerTransactions'
    });
  }

  static associate(models) {
    this.belongsTo(models.paymentCreditcards, { foreignKey: 'keyNsu', targetKey: 'keyNsu', as: 'crdcard' });
    this.hasMany(models.acquirerInstallments, { foreignKey: 'transactionId', sourceKey: 'id', as: 'installments' });
  };

  static async getCardBrandParams() {
    let attributes = ['cardBrandName', [sequelize.fn('sum', sequelize.col('grossAmount')), 'grossAmount'] ],
      group = ['acquirerTransactions.cardBrandName'],
      order = [['cardBrandName', 'ASC']];
    return { attributes, group, order, raw: true };
  }

  static async getPointOfSaleParams() {
    let attributes = ['pointOfSale', [sequelize.fn('sum', sequelize.col('grossAmount')), 'grossAmount'] ],
      group = ['acquirerTransactions.pointOfSale'],
      order = [['pointOfSale', 'ASC']];
    return { attributes, group, order, raw: true };
  }

  static async getCaptureTypeParams() {
    let attributes = ['captureType', [sequelize.fn('sum', sequelize.col('grossAmount')), 'grossAmount'] ],
      group = ['acquirerTransactions.captureType'],
      order = [['captureType', 'ASC']];
    return { attributes, group, order, raw: true };
  }

  static async getTermnialNoParams() {
    let attributes = ['terminalNo', [sequelize.fn('sum', sequelize.col('grossAmount')), 'grossAmount'] ],
      group = ['acquirerTransactions.terminalNo'],
      order = [['terminalNo', 'ASC']];
    return { attributes, group, order, raw: true };
  }

  static async listDashboardDetail(from, to, acquirer, tags) {
    let result = {},
      where = {
        captureDate: { [Op.gte]: from, [Op.lte]: to },
        acquirer: acquirer
      };
    if (_.isEmpty(tags) == false) {
      where['tag'] = { [Op.in]: tags };
    }
    const cardBrand = await this.findAll({where, ...await this.getCardBrandParams() });
    const pointOfSale = await this.findAll({where, ...await this.getPointOfSaleParams() });
    const captureType = await this.findAll({where, ...await this.getCaptureTypeParams() });
    const terminalNo = await this.findAll({where, ...await this.getTermnialNoParams() });

    result.cardBrand = cardBrand.map(o => { return { name: o.cardBrandName, amount: o.grossAmount } })
    result.pointOfSale = pointOfSale.map(o => { return { name: o.pointOfSale, amount: o.grossAmount } })
    result.captureType = captureType.map(o => { return { name: o.captureType, amount: o.grossAmount } })
    result.terminalNo = terminalNo.map(o => { return { name: o.terminalNo, amount: o.grossAmount } })

    return result;
  }
}
export default AcquirerTransaction;

