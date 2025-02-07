'use strict';

const tableName = 'dataSources'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(30), primaryKey: true, allowNull: false },
    name: { type: Sequelize.STRING(100), allowNull: false },
    mapping: { type: Sequelize.STRING(1), allowNull: false },
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
