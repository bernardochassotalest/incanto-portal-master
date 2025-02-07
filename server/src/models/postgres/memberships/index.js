import { Model, DataTypes } from 'sequelize';

class Memberships extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      saleItemId: DataTypes.STRING,
      sourceName: DataTypes.STRING,
      sourceDb: DataTypes.STRING,
      sourceId: DataTypes.STRING,
      itemId: DataTypes.STRING,
      itemCode: DataTypes.STRING,
      itemName: DataTypes.STRING,
      itemType: DataTypes.STRING,
      itemGroup: DataTypes.STRING,
      operation: DataTypes.STRING,
    },
    {
      sequelize, modelName: 'memberships'
    });
  }

  static associate(models) {
    this.belongsTo(models.saleItems, { foreignKey: 'saleItemId', as: 'itemData' });
  }
}

export default Memberships;
