import _ from 'lodash';
import sequelize, { DataTypes, Model, Op } from 'sequelize';

class Profile extends Model {
  static init(sequelize) {
    super.init(
      {
        active: DataTypes.BOOLEAN,
        name: DataTypes.STRING,
        permissions: DataTypes.STRING,
        tags: DataTypes.JSONB
      },
      {
        sequelize,
        modelName: 'profiles',
      }
    );
  };

  static associate(models) {
    this.belongsTo(models.accounts, { foreignKey: 'accountId', as: 'account' });
  };

  static async byAccount({ offset = 0, term }, user, transaction) {
    const limit = PAGE_SIZE,
      order = [['name', 'ASC']],
      attributes = ['id', 'active', 'name', 'createdAt'],
      where = { accountId: user.accountId };
    offset = isNaN(offset) ? 0 : offset * 1;

    if (!_.isEmpty(term)) {
      where[Op.col] = sequelize.where(
        sequelize.fn('lower', sequelize.col('name')),
        { [Op.substring]: _.toLower(term) }
      );
    }
    let { count = 0, rows = [] } = await this.findAndCountAll(
      { where, attributes, offset, limit, order },
      { transaction }
    );

    return { rows, offset, count, limit };
  };

  static async byAccountSearch({ term }, user, transaction) {
    const limit = PAGE_SIZE,
      order = [['name', 'ASC']],
      attributes = ['id', 'active', 'name'],
      where = { accountId: user.accountId, active: true };

    if (!_.isEmpty(term)) {
      where[Op.col] = sequelize.where(
        sequelize.fn('lower', sequelize.col('name')),
        { [Op.substring]: _.toLower(term) }
      );
    }
    let { rows = [] } = await this.findAndCountAll(
      { where, attributes, limit, order },
      { transaction }
    );
    return rows;
  };

  static async findSimilar(params = {}, { accountId }) {
    let where = {
      accountId,
      [Op.col]: sequelize.where(
        sequelize.fn('lower', sequelize.col('name')),
        _.toLower(params.name)
      ),
    };

    if (params.id) {
      where['id'] = { [Op.ne]: params.id };
    }
    return await this.findOne({ where, attributes: ['id'] });
  };
}

export default Profile;
