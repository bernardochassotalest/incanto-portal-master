'use strict';

const tableName = 'reportRequests'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    typeId: { type: Sequelize.STRING(50), allowNull: false, references: { model: 'reportTypes', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    status: { type: Sequelize.ENUM('pending', 'executing', 'available'), defaultValue: 'pending', allowNull: false },
    date: { type: Sequelize.STRING(10) },
    time: { type: Sequelize.STRING(10) },
    userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    filters: { type: Sequelize.JSON },
    timeLog: { type: Sequelize.STRING(50) },
    fileName: { type: Sequelize.STRING(500) },
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
