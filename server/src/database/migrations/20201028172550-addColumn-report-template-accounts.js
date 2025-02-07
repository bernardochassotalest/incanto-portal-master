'use strict';

const tableName = 'reportTemplateAccounts'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(tableName, 'templateId', { type: Sequelize.STRING(50), allowNull: false, references: { model: 'reportTemplates', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } }, { transaction }),
      ])
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn(tableName, 'templateId', { transaction }),
      ]);
    });
  },
};