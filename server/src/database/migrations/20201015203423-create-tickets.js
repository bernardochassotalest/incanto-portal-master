'use strict';

const tableName = 'tickets'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(100), primaryKey: true, allowNull: false },
    saleItemId: { type: Sequelize.STRING(100), allowNull: false },
    matchId: { type: Sequelize.STRING(50), allowNull: false },
    priceName: { type: Sequelize.STRING(100) },
    priceGroupName: { type: Sequelize.STRING(100) },
    priceAreaName: { type: Sequelize.STRING(100) },
    priceTreshold: { type: Sequelize.DECIMAL(13, 2) },
    fee: { type: Sequelize.DECIMAL(13, 2) },
    attendenceDate: { type: Sequelize.STRING(10) },
    gate: { type: Sequelize.STRING(50) },
    area: { type: Sequelize.STRING(50) },
    sector: { type: Sequelize.STRING(50) },
    row: { type: Sequelize.STRING(50) },
    seat: { type: Sequelize.STRING(50) },
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
