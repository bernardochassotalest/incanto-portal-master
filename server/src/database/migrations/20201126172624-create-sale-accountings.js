'use strict';

const tableName = 'saleAccountings'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    saleId: { type: Sequelize.STRING(100), allowNull: false, references: { model: 'sales', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    accountingItemId: { type: Sequelize.STRING(50), allowNull: false, references: { model: 'accountingItems', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    amount: { type: Sequelize.Sequelize.DECIMAL(13, 2) },
    timeLog: { type: Sequelize.STRING(50) },
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
