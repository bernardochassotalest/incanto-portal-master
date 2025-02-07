'use strict';

const tableName = 'acquirerBatches'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(tableName, 'rejectAmount', { type: Sequelize.DECIMAL(13, 2), defaultValue: 0 }, { transaction }),
      ])
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn(tableName, 'rejectAmount', { transaction }),
      ]);
    });
  },
};
