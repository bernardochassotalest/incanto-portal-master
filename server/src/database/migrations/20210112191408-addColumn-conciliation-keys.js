'use strict';

const tableName = 'conciliationKeys'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(tableName, 'userId', { type: Sequelize.INTEGER, references: { model: 'users', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } }, { transaction }),
      ])
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn(tableName, 'userId', { transaction }),
      ]);
    });
  },
};
