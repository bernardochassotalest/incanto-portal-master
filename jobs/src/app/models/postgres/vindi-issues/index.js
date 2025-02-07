import sequelize, { Model, DataTypes, Op } from 'sequelize';
import { postgres } from 'app/models'
import accountingConfig from 'config/accounting';

class VindiIssues extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      createDate: DataTypes.STRING,
      issueType: DataTypes.STRING,
      status: DataTypes.STRING,
      itemType: DataTypes.STRING,
      itemId: DataTypes.STRING,
      expectedAmount: DataTypes.DECIMAL(13, 2),
      transactionAmount: DataTypes.DECIMAL(13, 2),
      customerKey: DataTypes.STRING,
      customerName: DataTypes.STRING,
      customerEmail: DataTypes.STRING,
      customerCode: DataTypes.STRING,
    },
    {
      sequelize, modelName: 'vindiIssues'
    });
  }

  static associate(models) {
    this.belongsTo(models.customers, { foreignKey: 'customerId', as: 'customerData' })
    this.hasOne(models.vindiCharges, { foreignKey: 'id', sourceKey: 'itemId', as: 'chargeData' });
    this.hasMany(models.accountingItems, { foreignKey: 'sourceId', as: 'accountingData' });
  }

  static async listAccounting({refDate}) {
    let attributes = ['id', 'createDate', 'transactionAmount'],
      where = {
          createDate: refDate,
          '$accountingData.id$': null
      },
      include = [{
        model: postgres.VindiCharges,
        as: 'chargeData',
        required: true,
        attributes: ['id', 'billId', 'issuedDate'],
        where: { issuedDate: { [Op.gte]: accountingConfig.startDate } }
      }, {
        model: postgres.AccountingItems,
        as: 'accountingData',
        required: false,
        attributes: ['id'],
        where: { 'sourceDb': 'vindiIssues' }
      }];
    return await this.findAll({ attributes, where, include })
  }
}

export default VindiIssues;
