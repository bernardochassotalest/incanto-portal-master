'use strict';

const tableName = 'acquirerRejections'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    acquirer: { type: Sequelize.STRING(20), allowNull: false, references: { model: 'acquirers', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    batchGroup: { type: Sequelize.STRING(50) },
    keyNsu: { type: Sequelize.STRING(50) },
    keyTid: { type: Sequelize.STRING(50) },
    tag: { type: Sequelize.STRING(20) },
    pointOfSale: { type: Sequelize.STRING(20) },
    batchNo: { type: Sequelize.STRING(50) },
    saleType: { type: Sequelize.ENUM, values: [ 'debito', 'credito' ] },
    captureDate: { type: Sequelize.STRING(10) },
    captureTime: { type: Sequelize.STRING(10) },
    grossAmount: { type: Sequelize.DECIMAL(13, 2) },
    rate: { type: Sequelize.DECIMAL(13, 2) },
    commission: { type: Sequelize.DECIMAL(13, 2) },
    netAmount: { type: Sequelize.DECIMAL(13, 2) },
    nsu: { type: Sequelize.STRING(50) },
    authorization: { type: Sequelize.STRING(20) },
    tid: { type: Sequelize.STRING(50) },
    reference: { type: Sequelize.STRING(20) },
    cardNumber: { type: Sequelize.STRING(20) },
    cardBrandCode: { type: Sequelize.STRING(10) },
    cardBrandName: { type: Sequelize.STRING(50) },
    rejectionCode: { type: Sequelize.STRING(10) },
    rejectionName: { type: Sequelize.STRING(100) },
    captureType: { type: Sequelize.STRING(50) },
    terminalNo: { type: Sequelize.STRING(20) },
    sourceDb: { type: Sequelize.STRING(50) },
    sourceId: { type: Sequelize.STRING(50) },
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
