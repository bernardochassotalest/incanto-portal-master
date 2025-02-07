'use strict';

const tableName = 'paymentChecks'

const structure = (Sequelize) => {
  return {
    paymentId: { type: Sequelize.STRING(100), primaryKey: true, allowNull: false, references: { model: 'salePayments', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    bank: { type: Sequelize.STRING(3), allowNull: false, references: { model: 'banks', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    branch: { type: Sequelize.STRING(10) },
    account: { type: Sequelize.STRING(20) },
    chkNumber: { type: Sequelize.STRING(10) },
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
