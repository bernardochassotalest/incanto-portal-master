'use strict';

const tableName = 'customerReferences'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(100), primaryKey: true, allowNull: false },
    customerId: { type: Sequelize.STRING(50), allowNull: false, references: { model: 'customers', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    sourceName: { type: Sequelize.STRING(50) },
    sourceDb: { type: Sequelize.STRING(50) },
    sourceId: { type: Sequelize.STRING(50) },
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
