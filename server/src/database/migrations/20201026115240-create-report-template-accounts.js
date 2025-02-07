'use strict';

const tableName = 'reportTemplateAccounts'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    templateItemId: { type: Sequelize.STRING(50), allowNull: false, references: { model: 'reportTemplateItems', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    account: { type: Sequelize.STRING(20), allowNull: false, references: { model: 'chartOfAccounts', key: 'acctCode', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    order: { type: Sequelize.INTEGER },
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
