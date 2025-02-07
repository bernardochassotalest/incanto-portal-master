'use strict';

const tableName = 'sales'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(tableName, 'isCredit', { type: Sequelize.ENUM('none', 'true', 'false'), defaultValue: 'none', allowNull: false }, { transaction }),
      ])
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn(tableName, 'isCredit', { transaction }),
      ]);
    });
  },
};
