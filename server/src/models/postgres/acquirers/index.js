import sequelize, { Model, DataTypes, Op } from 'sequelize';
import _ from 'lodash';

class Acquirers extends Model {
  static init(sequelize) {
    super.init(
      {
        id: { type: DataTypes.STRING, primaryKey: true },
        name: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: 'acquirers',
      }
    );
  };

  static async load({ id }) {
    let where = { id };
    return await this.findOne({ where });
  };

  static async list({ offset = 0, term }) {
    let limit = PAGE_SIZE,
      order = [['name', 'ASC']],
      attributes = ['id', 'name', 'createdAt'],
      where = {};

    offset = isNaN(offset) ? 0 : offset * 1;

    if (!_.isEmpty(term)) {
      where[Op.col] = sequelize.where(
        sequelize.fn('lower', sequelize.col('name')),
        { [Op.substring]: _.toLower(term) }
      );
    }

    let { count = 0, rows = [] } = await this.findAndCountAll({ where, attributes, offset, limit, order });
    return { rows, offset, count, limit };
  };
}

export default Acquirers;
