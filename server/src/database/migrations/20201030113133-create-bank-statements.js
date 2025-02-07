'use strict';

const tableName = 'bankStatements'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    bank: { type: Sequelize.STRING(3), allowNull: false, references: { model: 'banks', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    branch: { type: Sequelize.STRING(10) },
    account: { type: Sequelize.STRING(20) },
    digitAccount: { type: Sequelize.STRING(2) },
    date: { type: Sequelize.STRING(10) },
    debit: { type: Sequelize.DECIMAL(13, 2) },
    credit: { type: Sequelize.DECIMAL(13, 2) },
    balance: { type: Sequelize.DECIMAL(13, 2) },
    category: { type: Sequelize.STRING(200) },
    cashFlow: { type: Sequelize.STRING(200) },
    notes: { type: Sequelize.STRING(200) },
    acquirer: { type: Sequelize.STRING(20) },
    pointOfSale: { type: Sequelize.STRING(20) },
    conciliationType: { type: Sequelize.ENUM, values: ['none', 'creditcard', 'slip', 'directDebit', 'slipFee'], allowNull: false },
    keyCommon: { type: Sequelize.STRING(200) },
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
