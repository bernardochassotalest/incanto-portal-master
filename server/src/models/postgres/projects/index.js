import sequelize, { Model, DataTypes, Op } from 'sequelize';
import _ from 'lodash';

class Projects extends Model {
  static init(sequelize) {
    super.init(
      {
        prjCode: { type: DataTypes.STRING, primaryKey: true },
        prjName: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: 'projects',
      }
    );
  };

  static async load({ prjCode }) {
    let where = { prjCode };
    return await this.findOne({ where });
  };

  static async list({ offset = 0, term }) {
    let limit = PAGE_SIZE,
      order = [['prjName', 'ASC']],
      attributes = ['prjCode', 'prjName', 'createdAt'],
      where = {};

    offset = isNaN(offset) ? 0 : offset * 1;

    if (!_.isEmpty(term)) {
      where[Op.col] = sequelize.where(
        sequelize.fn('lower', sequelize.col('prjName')),
        { [Op.substring]: _.toLower(term) }
      );
    }
    let { count = 0, rows = [] } = await this.findAndCountAll({ where, attributes, offset, limit, order });
    return { rows, offset, count, limit };
  };

  static async finding({ term, grpCode }) {
    const limit = PAGE_SIZE,
      order = [
        ['prjName', 'ASC'],
        ['prjCode', 'ASC'],
      ],
      attributes = ['prjCode', 'prjName'],
      where = {};

    if (!_.isEmpty(term)) {
      where[Op.or] = [
        { 'prjCode': { [Op.iLike]: `%${term}%` }},
        sequelize.where(sequelize.fn('lower', sequelize.col('prjName')),{ [Op.substring]: _.toLower(term) }),
      ];
    }

    let { rows = [] } = await this.findAndCountAll({ where, attributes, limit, order });
    return rows;
  };
}

export default Projects;
