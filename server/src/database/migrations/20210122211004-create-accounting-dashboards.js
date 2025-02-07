'use strict';

const tableName = 'accountingDashboards'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    group: { type: Sequelize.STRING(30), allowNull: false, references: { model: 'accountingModelGroups', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    type: { type: Sequelize.ENUM, values: [ 'invoiced', 'notCaptured', 'settlement', 'creditCard', 'slip', 'directDebit', 'pecld', 'canceled', 'fee'] },
    visOrder: { type: Sequelize.INTEGER },
    factor: { type: Sequelize.DECIMAL(5, 2) },
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
