'use strict';

const tableName = 'sales'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(tableName, 'cancelDate', { type: Sequelize.STRING(10), defaultValue: '' }, { transaction }),
        queryInterface.addColumn(tableName, 'isPecld', { type: Sequelize.ENUM('none', 'true', 'false'), defaultValue: 'none', allowNull: false }, { transaction }),
      ])
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn(tableName, 'cancelDate', { transaction }),
        queryInterface.removeColumn(tableName, 'isPecld', { transaction }),
      ]);
    });
  },
};
