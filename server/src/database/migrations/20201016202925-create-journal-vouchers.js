'use strict';

const tableName = 'journalVouchers'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    status: { type: Sequelize.ENUM, values: [ 'pending', 'confirmed', 'closed', 'error', 'canceled' ] },
    group: { type: Sequelize.STRING(30), allowNull: false, references: { model: 'accountingModelGroups', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    refDate: { type: Sequelize.STRING(10) },
    taxDate: { type: Sequelize.STRING(10) },
    dueDate: { type: Sequelize.STRING(10) },
    locTotal: { type: Sequelize.DECIMAL(13, 2) },
    tag: { type: Sequelize.STRING(20) },
    memo: { type: Sequelize.STRING(100) },
    ref3: { type: Sequelize.STRING(30) },
    projectId: { type: Sequelize.STRING(20) },
    pointOfSale: { type: Sequelize.STRING(20) },
    championshipId: { type: Sequelize.STRING(50) },
    matchId: { type: Sequelize.STRING(50) },
    transId: { type: Sequelize.STRING(20) },
    logMessage: { type: Sequelize.STRING(500) },
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
