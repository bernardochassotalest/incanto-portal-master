'use strict';

const tableName = 'conciliationMessages'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(tableName, 'memo', { type: Sequelize.STRING(500), defaultValue: '' }, { transaction }),
      ])
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn(tableName, 'memo', { transaction }),
      ]);
    });
  },
};
