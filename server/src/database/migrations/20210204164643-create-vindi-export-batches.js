'use strict';

const tableName = 'vindiExportBatches'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    status: { type: Sequelize.STRING(30) },
    url: { type: Sequelize.STRING(500) },
    createDate: { type: Sequelize.STRING(30) },
    updateDate: { type: Sequelize.STRING(30) },
    paymentId: { type: Sequelize.STRING(10) },
    paymentName: { type: Sequelize.STRING(100) },
    paymentCode: { type: Sequelize.STRING(50) },
    fileName: { type: Sequelize.STRING(100) },
    fileStatus: { type: Sequelize.ENUM, values: ['pending', 'exported', 'removed'] },
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

