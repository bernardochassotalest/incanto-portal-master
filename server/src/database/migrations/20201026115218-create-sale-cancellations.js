'use strict';

const tableName = 'saleCancellations'

const structure = (Sequelize) => {
  return {
    saleId: { type: Sequelize.STRING(100), primaryKey: true, allowNull: false, references: { model: 'sales', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    modelId: { type: Sequelize.STRING(50), allowNull: false, references: { model: 'cancellationModels', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    notes: { type: Sequelize.STRING(200), allowNull: false },
    userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
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
