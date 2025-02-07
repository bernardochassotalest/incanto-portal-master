import { postgres } from 'models'
import sequelize, { Model, DataTypes, Op } from 'sequelize';

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
}

export default VindiIssues;
