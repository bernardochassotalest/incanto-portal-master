'use strict';

const tableName = 'acquirerDisputes'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(tableName, 'saleId', { type: Sequelize.STRING(100), defaultValue: '' }, { transaction }),
      ])
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn(tableName, 'saleId', { transaction }),
      ]);
    });
  },
};
