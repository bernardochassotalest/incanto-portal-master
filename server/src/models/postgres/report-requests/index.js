import _ from 'lodash';
import { postgres } from 'models';
import sequelize, { Model, DataTypes, Op } from 'sequelize';

class ReportRequests extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      status: DataTypes.ENUM(['pending', 'executing', 'available']),
      date: DataTypes.STRING,
      time: DataTypes.STRING,
      filters: DataTypes.JSON,
      timeLog: DataTypes.STRING,
      fileName: DataTypes.STRING,
    },
    {
      sequelize, modelName: 'reportRequests'
    });
  }

  static associate(models) {
    this.belongsTo(models.reportTypes, { foreignKey: 'typeId', as: 'typeData' });
    this.belongsTo(models.users, { foreignKey: 'userId', as: 'userData' });
  }

  static async load({ id }) {
    let where = { id };
    return await this.findOne({ where });
  };

  static async list({ offset = 0, term }, user) {
    let limit = PAGE_SIZE,
      order = [['date', 'DESC'], ['time', 'DESC']],
      attributes = ['id', 'status', 'date', 'time', 'filters'],
      include = [{
        model: postgres.ReportTypes,
        as: 'typeData',
        required: true,
        attributes: ['id', 'name']
      }],
      where = {
        userId: user.id
      };

    offset = isNaN(offset) ? 0 : offset * 1;

    if (!_.isEmpty(term)) {
      where[Op.col] = sequelize.where(
        sequelize.fn('lower', sequelize.col('date')),
        { [Op.substring]: _.toLower(term) }
      );
    }

    let { count = 0, rows = [] } = await this.findAndCountAll({ where, attributes, include, offset, limit, order, distinct: true });
    return { rows, offset, count, limit };
  };
}

export default ReportRequests;
