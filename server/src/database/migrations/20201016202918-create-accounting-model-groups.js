'use strict';

const tableName = 'accountingModelGroups'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(30), primaryKey: true, allowNull: false },
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
