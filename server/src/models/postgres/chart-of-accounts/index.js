import sequelize, { Model, DataTypes, Op } from 'sequelize';
import _ from 'lodash';

class ChartOfAccounts extends Model {
  static init(sequelize) {
    super.init(
      {
        acctCode: { type: DataTypes.STRING, primaryKey: true },
        acctName: DataTypes.STRING,
        accountType: DataTypes.STRING,
        titleAccount: DataTypes.BOOLEAN,
        lockManual: DataTypes.BOOLEAN,
        level: DataTypes.INTEGER,
        group: DataTypes.INTEGER,
        grpLine: DataTypes.INTEGER,
        lastDate: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: 'chartOfAccounts',
      }
    );
  };

  static async load({ acctCode }) {
    let where = { acctCode };
    return await this.findOne({ where });
  };

  static async list({ offset = 0, term }) {
    let limit = PAGE_SIZE,
      order = [['group', 'ASC'], ['grpLine', 'ASC']],
      attributes = ['acctCode', 'acctName', 'accountType', 'createdAt', 'titleAccount'],
      where = {};

    offset = isNaN(offset) ? 0 : offset * 1;

    if (!_.isEmpty(term)) {
       where[Op.or] = [
        { acctCode: { [Op.startsWith]: term } },
        { [Op.col]: sequelize.where( sequelize.fn('lower', sequelize.col('acctName')), { [Op.substring]: _.toLower(term) } ) }
      ];
    }
    let { count = 0, rows = [] } = await this.findAndCountAll({ where, attributes, offset, order, limit });
    return { rows, offset, count, limit };
  };

  static async finding({ term, filter }) {
    const limit = PAGE_SIZE,
      order = [
        ['acctName', 'ASC'],
        ['acctCode', 'ASC'],
      ],
      attributes = [
        'acctCode',
        'acctName',
        'accountType',
        'lockManual',
        'group',
      ],
      where = { ...filter };

    if (!_.isEmpty(term)) {
      where[Op.or] = [
        { acctCode: { [Op.startsWith]: term } },
        { [Op.col]: sequelize.where( sequelize.fn('lower', sequelize.col('acctName')), { [Op.substring]: _.toLower(term) } ) }
      ];
    }

    let { rows = [] } = await this.findAndCountAll({ where, attributes, limit, order });
    return rows;
  };
}

export default ChartOfAccounts;
