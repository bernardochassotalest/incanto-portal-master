import sequelize, { Model, DataTypes, Op } from 'sequelize';
import _ from 'lodash';

class SaleItem extends Model {
  static init(sequelize) {
    super.init(
      {
        id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
        sourceName: DataTypes.STRING,
        sourceDb: DataTypes.STRING,
        sourceId: DataTypes.STRING,
        itemCode: DataTypes.STRING,
        itemName: DataTypes.STRING,
        ownerId: DataTypes.STRING,
        ownerVatNo: DataTypes.STRING,
        ownerName: DataTypes.STRING,
        quantity: DataTypes.DECIMAL(15, 6),
        unitPrice: DataTypes.DECIMAL(13, 2),
        discAmount: DataTypes.DECIMAL(13, 2),
        totalAmount: DataTypes.DECIMAL(13, 2),
      },
      {
        sequelize,
        modelName: 'saleItems'
      }
    );
  };

  static associate(models) {
    this.belongsTo(models.sales, { foreignKey: 'saleId', as: 'sale' });
    this.hasOne(models.memberships, { foreignKey: 'saleItemId', as: 'memberships' });
    this.hasOne(models.tickets, { foreignKey: 'saleItemId', as: 'tickets' });
  };

  static async findingProduct({ term }) {
    const limit = PAGE_SIZE,
      order = [ ['itemName', 'ASC'] ],
      attributes = [['itemCode', 'id'], ['itemName', 'name']],
      group = ['itemCode', 'itemName'],
      where = {};

    if (!_.isEmpty(term)) {
      where[Op.or] = [
        { 'itemCode': { [Op.like]: `%${term}%` }},
        sequelize.where(sequelize.fn('lower', sequelize.col('itemName')),{ [Op.substring]: _.toLower(term) }),
      ]
    }

    let { rows = [] } = await this.findAndCountAll({ where, attributes, limit, order, group });
    return rows;
  };

};

export default SaleItem;


