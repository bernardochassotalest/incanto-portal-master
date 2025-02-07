'use strict';

const tableName = 'slipOccurrences'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(tableName, 'fileName', { type: Sequelize.STRING(100), defaultValue: '' }, { transaction }),
        queryInterface.addColumn(tableName, 'fileLine', { type: Sequelize.INTEGER, defaultValue: 0 }, { transaction }),
      ])
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn(tableName, 'fileName', { transaction }),
        queryInterface.removeColumn(tableName, 'fileLine', { transaction }),
      ]);
    });
  },
};
