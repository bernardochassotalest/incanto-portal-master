'use strict';

const tableName = 'saleItems'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(100), primaryKey: true, allowNull: false },
    sourceName: { type: Sequelize.STRING(50) },
    sourceDb: { type: Sequelize.STRING(50) },
    sourceId: { type: Sequelize.STRING(50) },
    saleId: { type: Sequelize.STRING(100), allowNull: false, references: { model: 'sales', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    itemCode: { type: Sequelize.STRING(50) },
    itemName: { type: Sequelize.STRING(100) },
    quantity: { type: Sequelize.DECIMAL(15, 6) },
    unitPrice: { type: Sequelize.DECIMAL(13, 2) },
    discAmount: { type: Sequelize.DECIMAL(13, 2) },
    totalAmount: { type: Sequelize.DECIMAL(13, 2) },
    ownerId: { type: Sequelize.STRING(50) },
    ownerVatNo: { type: Sequelize.STRING(20) },
    ownerName: { type: Sequelize.STRING(200) },
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
