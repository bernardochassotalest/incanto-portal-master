'use strict';

const tableName = 'conciliationItems'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(100), primaryKey: true, allowNull: false },
    date: { type: Sequelize.STRING(10), allowNull: false, references: { model: 'conciliations', key: 'date', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    rule: { type: Sequelize.STRING(30), allowNull: false, references: { model: 'conciliationRules', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    sourceName: { type: Sequelize.STRING(50) },
    sourceDb: { type: Sequelize.STRING(50) },
    sourceId: { type: Sequelize.STRING(50) },
    pointOfSale: { type: Sequelize.STRING(20) },
    keyCommon: { type: Sequelize.STRING(200) },
    keyTid: { type: Sequelize.STRING(200) },
    keyNsu: { type: Sequelize.STRING(200) },
    credit: { type: Sequelize.DECIMAL(13, 2) },
    debit: { type: Sequelize.DECIMAL(13, 2) },
    balance: { type: Sequelize.DECIMAL(13, 2) },
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
