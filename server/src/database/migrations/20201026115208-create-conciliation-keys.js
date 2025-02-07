'use strict';

const tableName = 'conciliationKeys'

const structure = (Sequelize) => {
  return {
    conciliationItemId: { type: Sequelize.STRING(100), primaryKey: true, allowNull: false, references: { model: 'conciliationItems', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    keyId: { type: Sequelize.STRING(50), allowNull: false },
    notes: { type: Sequelize.STRING(200) },
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
