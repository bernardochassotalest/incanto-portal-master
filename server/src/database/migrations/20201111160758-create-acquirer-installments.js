'use strict';

const tableName = 'acquirerInstallments'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    transactionId: { type: Sequelize.STRING(50), allowNull: false, references: { model: 'acquirerTransactions', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    installment: { type: Sequelize.STRING(10) },
    transType: { type: Sequelize.ENUM, values: [ 'venda', 'liquidacao', 'antecipacao', 'cancelamento', 'chargeback' ] },
    dueDate: { type: Sequelize.STRING(10) },
    grossAmount: { type: Sequelize.Sequelize.DECIMAL(13, 2) },
    rate: { type: Sequelize.Sequelize.DECIMAL(13, 2) },
    commission: { type: Sequelize.Sequelize.DECIMAL(13, 2) },
    netAmount: { type: Sequelize.Sequelize.DECIMAL(13, 2) },
    acctContent: { type: Sequelize.JSON },
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
