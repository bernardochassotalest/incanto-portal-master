import sequelize, { Model, DataTypes, Op } from 'sequelize';
import _ from 'lodash';

class Tag extends Model {
  static init(sequelize) {
    super.init(
      {
        tag: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
      },
      {
        sequelize,
        modelName: 'tags'
      }
    );
  };

  static async listAll(user) {
    let attributes = ['tag'], where = {};
    if (!_.isEmpty(user.tags) && !user.profileId !== 1) {
      where['tag'] = user.tags;
    }
    return await this.findAll({ attributes, where });
  }

  static async finding({ term }, user) {
    const limit = PAGE_SIZE,
      order = [['tag', 'ASC']],
      where = {};

    if (!_.isEmpty(term)) {
      where[Op.col] = sequelize.where(sequelize.fn('lower', sequelize.col('tag')), { [Op.substring]: _.toLower(term) });
    }
    if (!_.isEmpty(user.tags) && !user.profileId !== 1) {
      where['tag'] = user.tags;
    }
    let { rows = [] } = await this.findAndCountAll({ where, limit, order });
    return rows;
  };
};

export default Tag;


