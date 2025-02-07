import { Model, DataTypes } from 'sequelize';

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
}

export default SaleItems;
