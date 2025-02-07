'use strict';

const tableName = 'reportTemplateItems'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    templateId: { type: Sequelize.STRING(50), allowNull: false, references: { model: 'reportTemplates', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    name: { type: Sequelize.STRING(200) },
    father: { type: Sequelize.STRING(50) },
    level: { type: Sequelize.INTEGER },
    order: { type: Sequelize.INTEGER },
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
