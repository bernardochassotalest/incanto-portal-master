'use strict';

const tableName = 'dateDimensions'

const structure = (Sequelize) => {
  return {
    day: { type: Sequelize.STRING(10), primaryKey: true, allowNull: false },
    week: { type: Sequelize.STRING(7) },
    month: { type: Sequelize.STRING(7) },
    year: { type: Sequelize.STRING(4) },
    quarter: { type: Sequelize.STRING(7) },
    semester: { type: Sequelize.STRING(7) },
    dayOfYear: { type: Sequelize.STRING(3) },
    lastDayOfMonth: { type: Sequelize.STRING(10) },
    weekDay: { type: Sequelize.INTEGER },
    weekDayName: { type: Sequelize.STRING(10) },
    abbrMonth: { type: Sequelize.STRING(3) },
    wideMonth: { type: Sequelize.STRING(10) },
    isHoliday: { type: Sequelize.BOOLEAN },
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, structure(Sequelize));
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.dropTable(tableName);
  }
};
