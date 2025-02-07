'use strict';

const tableName = 'costingCenters'

const structure = (Sequelize) => {
  return {
    ocrCode: { type: Sequelize.STRING(10), primaryKey: true, allowNull: false },
    ocrName: { type: Sequelize.STRING(100), allowNull: false },
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
