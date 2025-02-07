'use strict';

const tableName = 'conciliations'

const structure = (Sequelize) => {
  return {
    date: { type: Sequelize.STRING(10), primaryKey: true, allowNull: false },
    status: { type: Sequelize.ENUM, values: [ 'open', 'concilied', 'closed' ], allowNull: false },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false }
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, structure(Sequelize));
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.dropTable(tableName);
  }
};
