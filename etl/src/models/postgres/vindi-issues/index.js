import { Model, DataTypes } from 'sequelize';

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
      customerId: DataTypes.STRING,
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
    this.hasOne(models.vindiCharges, { foreignKey: 'itemId', as: 'chargeData' });
  }
}

export default VindiIssues;
