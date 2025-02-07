'use strict';

const tableName = 'customerCredits'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(tableName, 'isActive', { type: Sequelize.ENUM('none', 'true', 'false'), defaultValue: 'none', allowNull: false }, { transaction }),
      ])
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn(tableName, 'isActive', { transaction }),
      ]);
    });
  },
};
