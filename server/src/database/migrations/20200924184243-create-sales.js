'use strict';

const tableName = 'sales'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(100), primaryKey: true, allowNull: false },
    sourceName: { type: Sequelize.STRING(50) },
    sourceDb: { type: Sequelize.STRING(50) },
    sourceId: { type: Sequelize.STRING(50) },
    customerId: { type: Sequelize.STRING(50), allowNull: false, references: { model: 'customers', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    refDate: { type: Sequelize.STRING(10) },
    taxDate: { type: Sequelize.STRING(10) },
    dueDate: { type: Sequelize.STRING(10) },
    amount: { type: Sequelize.DECIMAL(13, 2) },
    status: { type: Sequelize.STRING(20) },
    tag: { type: Sequelize.STRING(50), allowNull: false, references: { model: 'tags', key: 'tag', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    startPeriod: { type: Sequelize.STRING(10) },
    endPeriod: { type: Sequelize.STRING(10) },
    isCaptured: { type: Sequelize.ENUM('none', 'true', 'false'), defaultValue: 'none', allowNull: false },
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
