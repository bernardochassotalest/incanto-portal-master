'use strict';

const tableName = 'sapB1Users'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(20), primaryKey: true, allowNull: false },
    name: { type: Sequelize.STRING(100) },
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
