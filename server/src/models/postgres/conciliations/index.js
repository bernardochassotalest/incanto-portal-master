import _ from 'lodash';
import { format } from 'date-fns';
import { Model, DataTypes, Op } from 'sequelize';
import { postgres } from 'models'

class Conciliations extends Model {
  static init(sequelize) {
    super.init({
        date: { type: DataTypes.STRING, primaryKey: true },
        status: {
            type: DataTypes.ENUM('open', 'concilied', 'closed'),
            defaultValue: 'open'
        }
    },
    {
        sequelize, modelName: 'conciliations'
    });
  }

  static associate(models) {
    this.hasOne(models.dateDimensions, { foreignKey: 'day', sourceKey: 'date', as: 'dimension' });
  };

  static async listDashboard(month) {
    let data = [],
      today = format(new Date(), 'yyyy-MM-dd'),
      attributes = ['date', 'status'],
      where = {
        '$dimension.month$': month
      },
      include = [{
        model: postgres.DateDimensions,
        as: 'dimension',
        required: true,
        attributes: ['weekDay','isHoliday']
      }],
      order = [['date', 'ASC']],
      list = await this.findAll({attributes, include, where, order });

    let sapB1Dates = await postgres.JournalEntries.listDashboardCalendar(month);
    for (let i = 0; i < list.length; i++) {
      let row = list[i],
        date = _.get(row, 'date', ''),
        status = (date > today ? 'future' : _.get(row, 'status', '')),
        item = {
          date: date,
          status: status,
          sapB1: 'none',
          weekDay: _.get(row, 'dimension.weekDay', 0),
          isHoliday: _.get(row, 'dimension.isHoliday', '')
        },
        found = _.findLast(sapB1Dates, { refDate: date });

      if (status == 'closed') {
        item['sapB1'] = (found ? 'open' : 'concilied');
      }

      data.push(item);
    }

    return data;
  }
}

export default Conciliations;
