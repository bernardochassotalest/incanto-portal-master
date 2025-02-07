'use strict';

const tableName = 'pointOfSales'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(100), primaryKey: true, allowNull: false },
    acquirer: { type: Sequelize.STRING(20), allowNull: false, references: { model: 'acquirers', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    code: { type: Sequelize.STRING(20) },
    tag: { type: Sequelize.STRING(50), allowNull: false, references: { model: 'tags', key: 'tag', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
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
