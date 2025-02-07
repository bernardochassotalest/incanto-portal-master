'use strict';

const tableName = 'messageTypes'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(20), primaryKey: true, allowNull: false },
    name: { type: Sequelize.STRING(200), allowNull: false },
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

