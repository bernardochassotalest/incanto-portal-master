'use strict';

const tableName = 'conciliationMessages'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    date: { type: Sequelize.STRING(10), allowNull: false, references: { model: 'conciliations', key: 'date', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    messageId: { type: Sequelize.STRING(20), allowNull: false, references: { model: 'messageTypes', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    sourceName: { type: Sequelize.STRING(50) },
    sourceDb: { type: Sequelize.STRING(50) },
    sourceId: { type: Sequelize.STRING(50) },
    isActive: { type: Sequelize.BOOLEAN },
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
