'use strict';

const tableName = 'vindiImportBatches'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    status: { type: Sequelize.ENUM, values: ['created', 'pending', 'discarded', 'processed', 'error'] },
    source: { type: Sequelize.STRING(20) },
    type: { type: Sequelize.STRING(20) },
    fileName: { type: Sequelize.STRING(50) },
    filePath: { type: Sequelize.STRING(200) },
    payMethodCode: { type: Sequelize.STRING(20) },
    payCompanyCode: { type: Sequelize.STRING(20) },
    batchId: { type: Sequelize.STRING(20) },
    batchStatus: { type: Sequelize.STRING(20) },
    batchResult: { type: Sequelize.JSON },
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
