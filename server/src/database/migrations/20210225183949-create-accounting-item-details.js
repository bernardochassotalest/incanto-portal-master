'use strict';

const tableName = 'accountingItemDetails'

const structure = (Sequelize) => {
  return {
    accountingItemId: { type: Sequelize.STRING(100), primaryKey: true, allowNull: false, references: { model: 'accountingItems', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    shortName: { type: Sequelize.STRING(20), references: { model: 'businessPartners', key: 'cardCode', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    costingCenter: { type: Sequelize.STRING(10), references: { model: 'costingCenters', key: 'ocrCode', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    project: { type: Sequelize.STRING(20), references: { model: 'projects', key: 'prjCode', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
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
