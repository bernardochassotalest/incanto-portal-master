'use strict';

const tableName = 'directDebitTransactions'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    keyCommon: { type: Sequelize.STRING(50) },
    crdBank: { type: Sequelize.STRING(3), allowNull: false, references: { model: 'banks', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    crdBranch: { type: Sequelize.STRING(10) },
    crdAccount: { type: Sequelize.STRING(20) },
    crdAcctDigit: { type: Sequelize.STRING(2) },
    debBank: { type: Sequelize.STRING(3), allowNull: false, references: { model: 'banks', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    debBranch: { type: Sequelize.STRING(10) },
    debAccount: { type: Sequelize.STRING(20) },
    debAcctDigit: { type: Sequelize.STRING(2) },
    tag: { type: Sequelize.STRING(20) },
    debitNumber: { type: Sequelize.STRING(30) },
    ourNumber: { type: Sequelize.STRING(20) },
    refDate: { type: Sequelize.STRING(10) },
    dueDate: { type: Sequelize.STRING(10) },
    amount: { type: Sequelize.DECIMAL(13, 2) },
    vatNumber: { type: Sequelize.STRING(20) },
    holderName: { type: Sequelize.STRING(200) },
    saleId: { type: Sequelize.STRING(100) },
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
