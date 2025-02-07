'use strict';

const tableName = 'vindiExportBatches'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(tableName, 'paymentType', { type: Sequelize.STRING(20), defaultValue: '' }, { transaction }),
      ])
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn(tableName, 'paymentType', { transaction }),
      ]);
    });
  },
};
