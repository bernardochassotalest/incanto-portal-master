'use strict';

const tableName = 'projects'

const structure = (Sequelize) => {
  return {
    prjCode: { type: Sequelize.STRING(20), primaryKey: true, allowNull: false },
    prjName: { type: Sequelize.STRING(100), allowNull: false },
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
