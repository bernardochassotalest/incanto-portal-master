'use strict';

const tableName = 'journalEntries'

const structure = (Sequelize) => {
  return {
    transId: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    transType: { type: Sequelize.STRING(50), references: { model: 'sapB1ObjectTypes', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    refDate: { type: Sequelize.STRING(10) },
    taxDate: { type: Sequelize.STRING(10) },
    dueDate: { type: Sequelize.STRING(10) },
    locTotal: { type: Sequelize.DECIMAL(13, 2) },
    tag: { type: Sequelize.STRING(20) },
    memo: { type: Sequelize.STRING(100) },
    ref1: { type: Sequelize.STRING(30) },
    ref2: { type: Sequelize.STRING(30) },
    ref3: { type: Sequelize.STRING(30) },
    projectId: { type: Sequelize.STRING(20) },
    pointOfSale: { type: Sequelize.STRING(20) },
    championshipId: { type: Sequelize.STRING(50) },
    matchId: { type: Sequelize.STRING(50) },
    reversed: { type: Sequelize.STRING(10) },
    userId: { type: Sequelize.STRING(20), references: { model: 'sapB1Users', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
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
