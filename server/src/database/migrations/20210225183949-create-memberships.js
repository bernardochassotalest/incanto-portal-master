'use strict';

const tableName = 'memberships'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(100), primaryKey: true, allowNull: false },
    saleItemId: { type: Sequelize.STRING(100), allowNull: false },
    sourceName: { type: Sequelize.STRING(50) },
    sourceDb: { type: Sequelize.STRING(50) },
    sourceId: { type: Sequelize.STRING(50) },
    itemId: { type: Sequelize.STRING(50) },
    itemCode: { type: Sequelize.STRING(50) },
    itemName: { type: Sequelize.STRING(100) },
    itemType: { type: Sequelize.STRING(50) },
    itemGroup: { type: Sequelize.STRING(50) },
    operation: { type: Sequelize.STRING(50) },
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
