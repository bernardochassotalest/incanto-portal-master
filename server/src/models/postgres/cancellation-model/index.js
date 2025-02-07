import sequelize, { Model, DataTypes, Op } from 'sequelize';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

class CancellationModel extends Model {
  static init(sequelize) {
    super.init(
      {
        id: { type: DataTypes.STRING, primaryKey: true },
        name: DataTypes.STRING
      },
      {
        sequelize,
        modelName: 'cancellationModels',
        hooks: {
          beforeCreate: this.hasBeforeCreate,
        }
      }
    );
  };

  static associate(models) {
    this.belongsTo(models.tags, { foreignKey: 'tag', as: 'tagData' });
  };

  static hasBeforeCreate(model) {
    model.id = uuidv4();
  };

  static async load({ id }) {
    let where = { id };
    return await this.findOne({ where });
  };

  static async list({ offset = 0, term }, user) {
    let limit = PAGE_SIZE,
      order = [['name', 'ASC']],
      attributes = ['id', 'name', 'tag', 'createdAt'],
      where = {};

    offset = isNaN(offset) ? 0 : offset * 1;

    if (!_.isEmpty(term)) {
      where[Op.col] = sequelize.where(sequelize.fn('lower', sequelize.col('name')),{ [Op.substring]: _.toLower(term) });
    }
    if (!_.isEmpty(user.tags) && !user.profileId !== 1) {
      where['tag'] = user.tags;
    }

    let { count = 0, rows = [] } = await this.findAndCountAll({ where, attributes, offset, limit, order });
    return { rows, offset, count, limit };
  };

  static async finding({ term, tag }) {
    const limit = PAGE_SIZE,
      order = [['name', 'ASC']],
      attributes = ['id', 'name', 'tag'],
      where = {};

    if (!_.isEmpty(term)) {
      where[Op.col] = sequelize.where( sequelize.fn('lower', sequelize.col('name')), { [Op.substring]: _.toLower(term) } );
    }
    if (tag) {
      where['tag'] = tag;
    }
    let { rows = [] } = await this.findAndCountAll({ where, attributes, limit, order });
    return rows;
  };
};

export default CancellationModel;
