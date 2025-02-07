'use strict';

const tableName = 'conciliationRules'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(30), primaryKey: true, allowNull: false },
    name: { type: Sequelize.STRING(50), allowNull: false },
    group: { type: Sequelize.STRING(50) },
    balanceType: { type: Sequelize.ENUM, values: [ 'zero', 'gte_zero' ] },
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
