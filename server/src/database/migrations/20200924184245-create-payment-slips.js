'use strict';

const tableName = 'paymentSlips'

const structure = (Sequelize) => {
  return {
    paymentId: { type: Sequelize.STRING(100), primaryKey: true, allowNull: false, references: { model: 'salePayments', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    bank: { type: Sequelize.STRING(3), allowNull: false, references: { model: 'banks', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    keyCommon: { type: Sequelize.STRING(50) },
    barCode: { type: Sequelize.STRING(50) },
    slipNumber: { type: Sequelize.STRING(30) },
    ourNumber: { type: Sequelize.STRING(30) },
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
