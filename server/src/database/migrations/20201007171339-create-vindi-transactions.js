'use strict';

const tableName = 'vindiTransactions'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    chargeId: { type: Sequelize.STRING(50) },
    transactionType: { type: Sequelize.STRING(20) },
    status: { type: Sequelize.STRING(20) },
    createDate: { type: Sequelize.STRING(10) },
    dueDate: { type: Sequelize.STRING(10) },
    paidDate: { type: Sequelize.STRING(10) },
    paymentMethod: { type: Sequelize.STRING(50) },
    authorization: { type: Sequelize.STRING(50) },
    tid: { type: Sequelize.STRING(50) },
    nsu: { type: Sequelize.STRING(50) },
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
