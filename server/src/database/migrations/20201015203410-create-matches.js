'use strict';

const tableName = 'matches'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    championshipId: { type: Sequelize.STRING(50) },
    name: { type: Sequelize.STRING(100) },
    date: { type: Sequelize.STRING(10) },
    time: { type: Sequelize.STRING(10) },
    opponent: { type: Sequelize.STRING(100) },
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
 