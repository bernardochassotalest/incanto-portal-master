'use strict';

const tableName = 'cancellationModels'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    tag: { type: Sequelize.STRING(50), allowNull: false, references: { model: 'tags', key: 'tag', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    name: { type: Sequelize.STRING(100), allowNull: false },
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
