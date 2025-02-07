'use strict';

const tableName = 'acquirerBatches'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    acquirer: { type: Sequelize.STRING(20), allowNull: false, references: { model: 'acquirers', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    batchGroup: { type: Sequelize.STRING(50) },
    batchSource: { type: Sequelize.STRING(50) },
    group: { type: Sequelize.ENUM, values: [ 'venda', 'liquidacao', 'saldo' ] },
    type: { type: Sequelize.ENUM, values: [ 'venda', 'liquidacao', 'antecipacao', 'cancelamento', 'chargeback', 'aluguel_equipamentos', 'ajuste_a_credito', 'ajuste_a_debito', 'saldo_inicial' ] },
    plan: { type: Sequelize.ENUM, values: [ 'avista', 'rotativo', 'parcelado' ] },
    tag: { type: Sequelize.STRING(20) },
    pointOfSale: { type: Sequelize.STRING(20) },
    batchNo: { type: Sequelize.STRING(50) },
    operationNo: { type: Sequelize.STRING(50) },
    refDate: { type: Sequelize.STRING(10) },
    taxDate: { type: Sequelize.STRING(10) },
    dueDate: { type: Sequelize.STRING(10) },
    payDate: { type: Sequelize.STRING(10) },
    cardBrandCode: { type: Sequelize.STRING(10) },
    cardBrandName: { type: Sequelize.STRING(50) },
    installment: { type: Sequelize.STRING(10) },
    qtyTransactions: { type: Sequelize.INTEGER },
    bankCode: { type: Sequelize.STRING(3) },
    bankBranch: { type: Sequelize.STRING(10) },
    bankAccount: { type: Sequelize.STRING(20) },
    notes: { type: Sequelize.STRING(100) },
    grossAmount: { type: Sequelize.Sequelize.DECIMAL(13, 2) },
    rate: { type: Sequelize.Sequelize.DECIMAL(13, 2) },
    commission: { type: Sequelize.Sequelize.DECIMAL(13, 2) },
    netAmount: { type: Sequelize.Sequelize.DECIMAL(13, 2) },
    adjustment: { type: Sequelize.Sequelize.DECIMAL(13, 2) },
    fee: { type: Sequelize.Sequelize.DECIMAL(13, 2) },
    settlement: { type: Sequelize.Sequelize.DECIMAL(13, 2) },
    sourceDb: { type: Sequelize.STRING(50) },
    sourceId: { type: Sequelize.STRING(50) },
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
