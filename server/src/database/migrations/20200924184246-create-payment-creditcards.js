'use strict';

const tableName = 'paymentCreditcards'

const structure = (Sequelize) => {
  return {
    paymentId: { type: Sequelize.STRING(100), primaryKey: true, allowNull: false, references: { model: 'salePayments', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    acquirer: { type: Sequelize.STRING(20), allowNull: false, references: { model: 'acquirers', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    keyCommon: { type: Sequelize.STRING(100) },
    keyNsu: { type: Sequelize.STRING(100) },
    keyTid: { type: Sequelize.STRING(100) },
    pointOfSale: { type: Sequelize.STRING(20) },
    time: { type: Sequelize.STRING(10) },
    tid: { type: Sequelize.STRING(50) },
    nsu: { type: Sequelize.STRING(50) },
    authorization: { type: Sequelize.STRING(50) },
    cardNumber: { type: Sequelize.STRING(20) },
    cardBrand: { type: Sequelize.STRING(30) },
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
