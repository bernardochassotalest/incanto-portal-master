'use strict';

const tableName = 'poolings'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(100), primaryKey: true, allowNull: false },
    periodType: { type: Sequelize.STRING(10) },
    startDate: { type: Sequelize.STRING(10) },
    startCycle: { type: Sequelize.STRING(2) },
    lastExecution: { type: Sequelize.STRING(20) },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false }
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
