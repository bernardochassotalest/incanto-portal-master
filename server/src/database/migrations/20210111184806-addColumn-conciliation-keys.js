'use strict';

const tableName = 'conciliationKeys'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(tableName, 'isManual', { type: Sequelize.ENUM('none', 'true', 'false'), defaultValue: 'none', allowNull: false }, { transaction }),
      ])
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn(tableName, 'isManual', { transaction }),
      ]);
    });
  },
};
