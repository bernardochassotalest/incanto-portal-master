'use strict';

const tableName = 'reportTemplates';

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    name: { type: Sequelize.STRING(100), allowNull: false },
    type: { type: Sequelize.ENUM, values: [ 'balance_sheet', 'trial_balance', 'profit_loss' ], allowNull: false },
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
