'use strict';

const tableName = 'slipTransactions'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    bank: { type: Sequelize.STRING(3), allowNull: false, references: { model: 'banks', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    keyCommon: { type: Sequelize.STRING(50) },
    branch: { type: Sequelize.STRING(10) },
    account: { type: Sequelize.STRING(20) },
    digitAccount: { type: Sequelize.STRING(2) },
    tag: { type: Sequelize.STRING(20) },
    slipNumber: { type: Sequelize.STRING(30) },
    ourNumber: { type: Sequelize.STRING(20) },
    digitOurNumber: { type: Sequelize.STRING(2) },
    reference: { type: Sequelize.STRING(20) },
    wallet: { type: Sequelize.STRING(5) },
    kind: { type: Sequelize.STRING(50) },
    refDate: { type: Sequelize.STRING(10) },
    dueDate: { type: Sequelize.STRING(10) },
    amount: { type: Sequelize.DECIMAL(13, 2) },
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
