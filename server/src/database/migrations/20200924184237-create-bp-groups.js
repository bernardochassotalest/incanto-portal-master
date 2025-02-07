'use strict';

const tableName = 'bpGroups'

const structure = (Sequelize) => {
  return {
    grpCode: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false },
    grpName: { type: Sequelize.STRING(100), allowNull: false },
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
