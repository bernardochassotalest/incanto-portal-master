'use strict';

const tableName = 'journalEntryItems'

const structure = (Sequelize) => {
  return {
    transId: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false, references: { model: 'journalEntries', key: 'transId', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    lineId: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    visOrder: { type: Sequelize.INTEGER },
    account: { type: Sequelize.STRING(20), allowNull: false, references: { model: 'chartOfAccounts', key: 'acctCode', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    shortName: { type: Sequelize.STRING(20), references: { model: 'businessPartners', key: 'cardCode', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    dueDate: { type: Sequelize.STRING(10) },
    debit: { type: Sequelize.DECIMAL(13, 2) },
    credit: { type: Sequelize.DECIMAL(13, 2) },
    balance: { type: Sequelize.DECIMAL(13, 2) },
    balDueDeb: { type: Sequelize.DECIMAL(13, 2) },
    balDueCred: { type: Sequelize.DECIMAL(13, 2) },
    project: { type: Sequelize.STRING(20), references: { model: 'projects', key: 'prjCode', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    contraAct: { type: Sequelize.STRING(20) },
    memo: { type: Sequelize.STRING(100) },
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
