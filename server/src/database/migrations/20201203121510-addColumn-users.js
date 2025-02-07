'use strict';

const tableName = 'users'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(tableName, 'canNotify', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false}, { transaction }),
      ])
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn(tableName, 'canNotify', { transaction }),
      ]);
    });
  },
};
