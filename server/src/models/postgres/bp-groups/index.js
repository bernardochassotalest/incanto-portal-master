import sequelize, { Model, DataTypes, Op } from 'sequelize';
import _ from 'lodash';

class BpGroups extends Model {
  static init(sequelize) {
    super.init(
      {
        grpCode: { type: DataTypes.INTEGER, primaryKey: true },
        grpName: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: 'bpGroups',
      }
    );
  };

  static async load({ grpCode }) {
    let where = { grpCode };
    return await this.findOne({ where });
  };

  static async list({ offset = 0, term }) {
    let limit = PAGE_SIZE,
      order = [['grpName', 'ASC']],
      attributes = ['grpCode', 'grpName'],
      where = {};

    offset = isNaN(offset) ? 0 : offset * 1;

    if (!_.isEmpty(term)) {
      where[Op.col] = sequelize.where(
        sequelize.fn('lower', sequelize.col('grpName')),
        { [Op.substring]: _.toLower(term) }
      );
    }

    let { count = 0, rows = [] } = await this.findAndCountAll({ where, attributes, offset, limit, order });
    return { rows, offset, count, limit };
  };

  static async finding({ term }, user) {
    const limit = PAGE_SIZE
      , order = [ ['grpName', 'ASC'] ]
      , attributes = ['grpCode', 'grpName']
      , where = {};

    if (!_.isEmpty(term)) {
      where[Op.col] = sequelize.where(sequelize.fn('lower', sequelize.col('grpName')), { [Op.substring]: _.toLower(term) });
    }

    let { rows = [] } = await this.findAndCountAll({ where, attributes, limit, order });
    return rows;
  };
}

export default BpGroups;
