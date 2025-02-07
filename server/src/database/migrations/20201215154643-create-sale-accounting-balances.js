'use strict';

const tableName = 'saleAccountingBalances'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    saleAccountingId: { type: Sequelize.STRING(50), allowNull: false, references: { model: 'saleAccountings', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    type: { type: Sequelize.ENUM('none', 'sale', 'slip', 'creditCard', 'directDebit', 'billCredit', 'notCaptured', 'pecld'), defaultValue: 'none', allowNull: false },
    balance: { type: Sequelize.Sequelize.DECIMAL(13, 2) },
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
