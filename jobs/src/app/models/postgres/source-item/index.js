import sequelize, { Model, DataTypes, Op, Sequelize } from 'sequelize';
import _ from 'lodash';

class SourceItem extends Model {
  static init(sequelize) {
    super.init(
      {
        id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
        name: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        modelName: 'sourceItems',
      }
    );
  };

  static associate(models) {
    this.belongsTo(models.dataSources, { foreignKey: 'id', as: 'source' });
  };

  static async finding({ term, sourceId }) {
    const limit = PAGE_SIZE,
      order = [
        ['name', 'ASC'],
        ['id', 'ASC'],
      ],
      attributes = ['id', 'name'],
      where = {
        source: sourceId,
      };

    if (!_.isEmpty(term)) {
      where[Op.col] = sequelize.where(
        sequelize.fn('lower', sequelize.col('name')),
        { [Op.substring]: _.toLower(term) }
      );
    }

    let { rows = [] } = await this.findAndCountAll({ where, attributes, limit, order });
    return rows;
  };
}

export default SourceItem;