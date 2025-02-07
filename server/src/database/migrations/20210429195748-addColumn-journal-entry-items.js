'use strict';

const tableName = 'journalEntryItems'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(tableName, 'extrMatch', { type: Sequelize.INTEGER, defaultValue: 0 }, { transaction }),
      ])
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn(tableName, 'extrMatch', { transaction }),
      ]);
    });
  },
};
