'use strict';

const tableName = 'acquirerSettlements'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    transactionId: { type: Sequelize.STRING(50), allowNull: false, references: { model: 'acquirerTransactions', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    installment: { type: Sequelize.STRING(10) },
    transType: { type: Sequelize.ENUM, values: ['liquidacao', 'antecipacao', 'taxa_administracao', 'taxa_antecipacao', 'cancelamento', 'chargeback', 'ajuste_a_debito', 'ajuste_a_credito'] },
    dueDate: { type: Sequelize.STRING(10) },
    paidDate: { type: Sequelize.STRING(10) },
    amount: { type: Sequelize.Sequelize.DECIMAL(13, 2) },
    notes: { type: Sequelize.STRING(100) },
    fileName: { type: Sequelize.STRING(100) },
    fileLine: { type: Sequelize.INTEGER },
    accountingItemId: { type: Sequelize.STRING(50) },
    saleAccountingId: { type: Sequelize.STRING(50) },
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
