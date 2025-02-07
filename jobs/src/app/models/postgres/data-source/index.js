import sequelize, { Model, DataTypes, Op } from 'sequelize';
import _ from 'lodash';

class DataSource extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        mapping: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
      },
      {
        sequelize,
        modelName: 'dataSources',
      }
    );
  };

  static async finding({ term }, user) {
    const limit = PAGE_SIZE,
      order = [
        ['name', 'ASC'],
        ['id', 'ASC'],
      ],
      attributes = ['id', 'name'],
      where = {};

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

export default DataSource;
