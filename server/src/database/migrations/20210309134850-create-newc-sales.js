'use strict';

const tableName = 'newcSales'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    status: { type: Sequelize.ENUM, values: ['noCustomer', 'processed'] },
    ownerId: { type: Sequelize.STRING(20) },
    coownerId: { type: Sequelize.STRING(20) },
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

