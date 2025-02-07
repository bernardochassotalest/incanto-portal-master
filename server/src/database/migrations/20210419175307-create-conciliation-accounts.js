'use strict';

const tableName = 'conciliationAccounts'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    acctCode: { type: Sequelize.STRING(20), allowNull: false, references: { model: 'chartOfAccounts', key: 'acctCode', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    cardCode: { type: Sequelize.STRING(20), references: { model: 'businessPartners', key: 'cardCode', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    type: { type: Sequelize.ENUM('none', 'account', 'finance'), defaultValue: 'none', allowNull: false },
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
