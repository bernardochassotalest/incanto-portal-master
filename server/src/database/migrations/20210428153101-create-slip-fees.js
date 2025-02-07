'use strict';

const tableName = 'slipFees'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    keyCommon: { type: Sequelize.STRING(50) },
    bank: { type: Sequelize.STRING(3), allowNull: false, references: { model: 'banks', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    branch: { type: Sequelize.STRING(10) },
    account: { type: Sequelize.STRING(20) },
    digitAccount: { type: Sequelize.STRING(2) },
    tag: { type: Sequelize.STRING(20) },
    date: { type: Sequelize.STRING(10) },
    feeNumber: { type: Sequelize.STRING(20) },
    amount: { type: Sequelize.DECIMAL(13, 2) },
    wallet: { type: Sequelize.STRING(5) },
    occurId: { type: Sequelize.STRING(20) },
    occurName: { type: Sequelize.STRING(100) },
    sourceDb: { type: Sequelize.STRING(50) },
    sourceId: { type: Sequelize.STRING(50) },
    fileName: { type: Sequelize.STRING(100) },
    fileLine: { type: Sequelize.INTEGER },
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
