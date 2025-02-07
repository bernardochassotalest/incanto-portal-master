import { postgres } from 'app/models';
import { Model, DataTypes, Op } from 'sequelize';

class SaleItems extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      sourceName: DataTypes.STRING,
      sourceDb: DataTypes.STRING,
      sourceId: DataTypes.STRING,
      saleId: DataTypes.STRING,
      itemCode: DataTypes.STRING,
      itemName: DataTypes.STRING,
      quantity: DataTypes.DECIMAL(15, 6),
      unitPrice: DataTypes.DECIMAL(13, 2),
      discAmount: DataTypes.DECIMAL(13, 2),
      totalAmount: DataTypes.DECIMAL(13, 2),
      ownerId: DataTypes.STRING,
      ownerVatNo: DataTypes.STRING,
      ownerName: DataTypes.STRING,
    },
    {
      sequelize, modelName: 'saleItems'
    });
  }

  static associate(models) {
    this.belongsTo(models.sales, { foreignKey: 'saleId', as: 'saleData' });
    this.hasMany(models.accountingItems, { foreignKey: 'sourceId', as: 'accountingData' });
  }

  static async countAccounting(refDate) {
    let where = {
        totalAmount: { [Op.gt]: 0},
        '$accountingData.id$': null
      },
      include = [{
        model: postgres.Sales,
        as: 'saleData',
        required: true,
        where: { refDate },
        attributes: []
      },{
        model: postgres.AccountingItems,
        as: 'accountingData',
        required: false,
        where: { 'sourceDb': 'saleItems' },
        attributes: []
      }];
    return await this.count({ where, include });
  };

}

export default SaleItems;
