import { Model, DataTypes } from 'sequelize';

class DateDimensions extends Model {
  static init(sequelize) {
    super.init({
      day: { type: DataTypes.STRING, primaryKey: true },
      week: DataTypes.STRING,
      month: DataTypes.STRING,
      year: DataTypes.STRING,
      quarter: DataTypes.STRING,
      semester: DataTypes.STRING,
      dayOfYear: DataTypes.STRING,
      lastDayOfMonth: DataTypes.STRING,
      weekDay: DataTypes.INTEGER,
      weekDayName: DataTypes.STRING,
      abbrMonth: DataTypes.STRING,
      wideMonth: DataTypes.STRING,
      isHoliday: DataTypes.BOOLEAN,
    },
    {
      sequelize, modelName: 'dateDimensions'
    });
  }
}

export default DateDimensions;
