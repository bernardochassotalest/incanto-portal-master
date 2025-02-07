'use strict';

const tableName = 'salePayments'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(100), primaryKey: true, allowNull: false },
    sourceName: { type: Sequelize.STRING(50) },
    sourceDb: { type: Sequelize.STRING(50) },
    sourceId: { type: Sequelize.STRING(50) },
    saleId: { type: Sequelize.STRING(100) },
    tag: { type: Sequelize.STRING(50), allowNull: false, references: { model: 'tags', key: 'tag', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    refDate: { type: Sequelize.STRING(10) },
    taxDate: { type: Sequelize.STRING(10) },
    dueDate: { type: Sequelize.STRING(10) },
    amount: { type: Sequelize.DECIMAL(13, 2) },
    status: { type: Sequelize.ENUM, values: [ 'pending', 'paid', 'canceled' ] },
    type: { type: Sequelize.STRING(30), allowNull: false, references: { model: 'paymentTypes', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    isConcilied: { type: Sequelize.BOOLEAN },
    timeLog: { type: Sequelize.STRING(50) },
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
