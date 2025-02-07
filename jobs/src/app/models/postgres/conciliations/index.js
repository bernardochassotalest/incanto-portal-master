import _ from 'lodash';
import { getEndDate, getMoreDays } from 'app/lib/utils';
import sequelize, { Model, DataTypes, Op, literal } from 'sequelize';
import accountingConfig from 'config/accounting';

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

  static async listOpened() {
    let attributes = ['date'],
      where = {
        status: 'open',
        date: {
          [Op.gte]: accountingConfig.startDate,
          [Op.lt]: getEndDate()
        }
      },
      order = [['date', 'ASC']];

    let rows = await this.findAll({attributes, where, order, raw: true });

    return _.get(_.first(rows), 'date', '');
  }

  static async listConcilied() {
    let attributes = ['date'],
      endDate = getEndDate(),
      queryDate = `
        (Select Coalesce(Min(T10."date"), '9999-99-99') As "date"
         From "conciliations" T10
         Where T10."date" >= '${accountingConfig.startDate}' and T10."date" < '${endDate}' and T10."status" = 'open')`,
      where = {
        status: 'concilied',
        date: {
          [Op.gte]: accountingConfig.startDate,
          [Op.lt]: endDate,
          [Op.lte]: sequelize.literal(_.trim(queryDate))
        }
      },
      order = [['date', 'ASC']];

    return await this.findAll({attributes, where, order, raw: true });
  }

  static async listSettlement() {
    let attributes = ['date'],
      where = {
        status: { [Op.ne]: 'closed' },
        date: {
          [Op.gte]: accountingConfig.startDate,
          [Op.lt]: getMoreDays(getEndDate(), 40)
        }
      };
    return await this.findAll({attributes, where, raw: true });
  }

  static async changeStatus(date, status) {
      return await this.update({ status }, { where: { date } });
  }
}

export default Conciliations;
