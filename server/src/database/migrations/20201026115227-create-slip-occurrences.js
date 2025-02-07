'use strict';

const tableName = 'slipOccurrences'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    transactionId: { type: Sequelize.STRING(50), allowNull: false, references: { model: 'slipTransactions', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    type: { type: Sequelize.ENUM('none', 'capture', 'settlement', 'cancellation'), defaultValue: 'none', allowNull: false },
    occurId: { type: Sequelize.STRING(20) },
    occurName: { type: Sequelize.STRING(100) },
    paidPlace: { type: Sequelize.STRING(100) },
    date: { type: Sequelize.STRING(10) },
    amount: { type: Sequelize.DECIMAL(13, 2) },
    discount: { type: Sequelize.DECIMAL(13, 2) },
    interest: { type: Sequelize.DECIMAL(13, 2) },
    balance: { type: Sequelize.DECIMAL(13, 2) },
    sourceDb: { type: Sequelize.STRING(50) },
    sourceId: { type: Sequelize.STRING(50) },
    acctContent: { type: Sequelize.JSON },
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


