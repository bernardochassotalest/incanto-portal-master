'use strict';

const tableName = 'customerCredits'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn(tableName, 'tag', { type: Sequelize.STRING(50), allowNull: false, defaultValue: 'sep', references: { model: 'tags', key: 'tag', onUpdate: 'CASCADE', onDelete: 'CASCADE' } }, { transaction }),
      ])
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn(tableName, 'tag', { transaction }),
      ]);
    });
  },
};
