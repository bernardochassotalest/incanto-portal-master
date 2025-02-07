'use strict';

const tableName = 'acquirerDisputes'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    acquirer: { type: Sequelize.STRING(20), allowNull: false, references: { model: 'acquirers', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    batchGroup: { type: Sequelize.STRING(50) },
    keyNsu: { type: Sequelize.STRING(100) },
    keyTid: { type: Sequelize.STRING(100) },
    tag: { type: Sequelize.STRING(20) },
    pointOfSale: { type: Sequelize.STRING(20) },
    batchNo: { type: Sequelize.STRING(50) },
    saleDate: { type: Sequelize.STRING(10) },
    endDate: { type: Sequelize.STRING(10) },
    processNo: { type: Sequelize.STRING(20) },
    reference: { type: Sequelize.STRING(20) },
    nsu: { type: Sequelize.STRING(50) },
    authorization: { type: Sequelize.STRING(20) },
    tid: { type: Sequelize.STRING(50) },
    amount: { type: Sequelize.DECIMAL(13, 2) },
    cardNumber: { type: Sequelize.STRING(20) },
    cardBrandCode: { type: Sequelize.STRING(10) },
    cardBrandName: { type: Sequelize.STRING(50) },
    notes: { type: Sequelize.STRING(500) },
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

