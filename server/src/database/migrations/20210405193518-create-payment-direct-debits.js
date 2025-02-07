'use strict';

const tableName = 'paymentDirectDebits'

const structure = (Sequelize) => {
  return {
    paymentId: { type: Sequelize.STRING(100), primaryKey: true, allowNull: false, references: { model: 'salePayments', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    keyCommon: { type: Sequelize.STRING(50) },
    bank: { type: Sequelize.STRING(3), allowNull: false, references: { model: 'banks', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    branch: { type: Sequelize.STRING(10) },
    account: { type: Sequelize.STRING(20) },
    debitNumber: { type: Sequelize.STRING(20) },
    vatNumber: { type: Sequelize.STRING(20) },
    holderName: { type: Sequelize.STRING(200) },
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
