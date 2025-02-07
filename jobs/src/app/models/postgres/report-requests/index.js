import _ from 'lodash';
import { postgres } from 'app/models'
import { getYesterdayDate, getTimeLog, toBase64 } from 'app/lib/utils'
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

  static async listById(id) {
    let where = { id, status: 'pending' },
        attributes = ['id', 'typeId', 'filters'],
        include = [{
          model: postgres.User,
          as: 'userData',
          required: true,
          attributes: ['name', 'email'],
          include: [{
            model: postgres.Profile,
            as: 'profile',
            required: true,
            attributes: ['tags']
          }]
        }],
        data = _.first(await this.findAll({ where, attributes, include }));

    const idReport = _.get(data, 'id', ''),
      email = _.get(data, 'userData.email', ''),
      name = _.get(data, 'userData.name', ''),
      isoDate = getTimeLog();

    data['log'] = toBase64(`${idReport} - ${email} - ${name} - ${isoDate}`);

    return data;
  }

  static async listPending() {
    let where = {
          status: 'pending'
        },
        attributes = ['id', 'typeId', 'filters'];
    return await this.findAll({ where, attributes });
  }
  static async listToRemove() {
    let where = {
        date: { [Op.lt]: getYesterdayDate() }
      },
      attributes = [ 'id', 'fileName' ];
    return await this.findAll({ where, attributes });
  }
}

export default ReportRequests;
