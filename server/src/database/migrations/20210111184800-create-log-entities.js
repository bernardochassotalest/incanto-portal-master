'use strict';

const tableName = 'logEntities'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    timeLog: { type: Sequelize.STRING(50) },
    sourceDb: { type: Sequelize.STRING(50) },
    sourceId: { type: Sequelize.STRING(50) },
    action: { type: Sequelize.ENUM('none', 'insert', 'update', 'delete'), defaultValue: 'none', allowNull: false },
    beforeData: { type: Sequelize.JSON },
    afterData: { type: Sequelize.JSON },
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
