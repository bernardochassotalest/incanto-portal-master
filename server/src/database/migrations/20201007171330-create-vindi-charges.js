'use strict';

const tableName = 'vindiCharges'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    billId: { type: Sequelize.STRING(20) },
    status: { type: Sequelize.STRING(20) },
    issuedDate: { type: Sequelize.STRING(10) },
    createDate: { type: Sequelize.STRING(10) },
    dueDate: { type: Sequelize.STRING(10) },
    paidDate: { type: Sequelize.STRING(10) },
    paymentMethod: { type: Sequelize.STRING(50) },
    amount: { type: Sequelize.DECIMAL(13, 2) },
    content: { type: Sequelize.JSON },
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
