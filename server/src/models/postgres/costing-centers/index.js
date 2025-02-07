import sequelize, { Model, DataTypes, Op } from 'sequelize';
import _ from 'lodash';

class CostingCenters extends Model {
  static init(sequelize) {
    super.init(
      {
        ocrCode: { type: DataTypes.STRING, primaryKey: true },
        ocrName: DataTypes.STRING,
        locked: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        modelName: 'costingCenters',
      }
    );
  };

  static async load({ ocrCode }) {
    let where = { ocrCode };
    return await this.findOne({ where });
  };

  static async list({ offset = 0, term }) {
    let limit = PAGE_SIZE,
      attributes = ['ocrCode', 'ocrName', 'createdAt'],
      where = {
        locked: false
      },
      order = [['ocrName', 'ASC']];

    offset = isNaN(offset) ? 0 : offset * 1;

    if (!_.isEmpty(term)) {
      where[Op.col] = sequelize.where(
        sequelize.fn('lower', sequelize.col('ocrName')),
        { [Op.substring]: _.toLower(term) }
      );
    }
    let { count = 0, rows = [] } = await this.findAndCountAll({ where, attributes, order, offset, limit });
    return { rows, offset, count, limit };
  };

  static async finding({ term, grpCode }) {
    const limit = PAGE_SIZE,
      order = [
        ['ocrName', 'ASC'],
        ['ocrCode', 'ASC'],
      ],
      attributes = ['ocrCode', 'ocrName'],
      where = {
        locked: false
      };

    if (!_.isEmpty(term)) {
      where[Op.or] = [
        { 'ocrCode': { [Op.iLike]: `%${term}%` }},
        sequelize.where(sequelize.fn('lower', sequelize.col('ocrName')),{ [Op.substring]: _.toLower(term) }),
      ];
    }

    let { rows = [] } = await this.findAndCountAll({ where, attributes, limit, });
    return rows;
  };
}

export default CostingCenters;
