import _ from 'lodash';
import sequelize, { Model, DataTypes, Op } from 'sequelize';

class ReportTypes extends Model {
  static init(sequelize) {
    super.init({
      id: { type: DataTypes.STRING, primaryKey: true },
      name: DataTypes.STRING,
    },
    {
      sequelize, modelName: 'reportTypes'
    });
  }

  static associate(models) {
    this.hasMany(models.reportRequests, { foreignKey: 'typeId', as: 'requestsData' });
  }

  static async finding({ term }, user) {
    const limit = PAGE_SIZE
      , order = [ ['name', 'ASC'] ]
      , attributes = ['id', 'name']
      , where = {};

    if (!_.isEmpty(term)) {
      where[Op.col] = sequelize.where(sequelize.fn('lower', sequelize.col('name')), { [Op.substring]: _.toLower(term) });
    }

    let { rows = [] } = await this.findAndCountAll({ where, attributes, limit, order });
    return rows;
  };
}

export default ReportTypes;
