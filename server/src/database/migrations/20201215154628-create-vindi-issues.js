'use strict';

const tableName = 'vindiIssues'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    createDate: { type: Sequelize.STRING(10) },
    issueType: { type: Sequelize.STRING(50) },
    status: { type: Sequelize.STRING(20) },
    itemType: { type: Sequelize.STRING(30) },
    itemId: { type: Sequelize.STRING(50) },
    expectedAmount: { type: Sequelize.DECIMAL(13, 2) },
    transactionAmount: { type: Sequelize.DECIMAL(13, 2) },
    customerId: { type: Sequelize.STRING(50) },
    customerKey: { type: Sequelize.STRING(50) },
    customerName: { type: Sequelize.STRING(200) },
    customerEmail: { type: Sequelize.STRING(200) },
    customerCode: { type: Sequelize.STRING(20) },
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
