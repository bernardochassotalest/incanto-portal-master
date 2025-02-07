'use strict';

const tableName = 'acquirerBatches'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(tableName, 'qtyRejections', { type: Sequelize.INTEGER }, { transaction }),
      ])
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn(tableName, 'qtyRejections', { transaction }),
      ]);
    });
  },
};
