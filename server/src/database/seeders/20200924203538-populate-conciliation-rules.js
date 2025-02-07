'use strict';

const tableName = 'conciliationRules'
const content = [
  { id: 'vindi_billing', name: 'Vindi: Faturamento x Cobranças', group: 'receitas', balanceType: 'gte_zero', createdAt: new Date(), updatedAt: new Date() },
  { id: 'slip_capture', name: 'Boletos: Captura', group: 'captura', balanceType: 'zero', createdAt: new Date(), updatedAt: new Date() },
  { id: 'slip_canceled', name: 'Boletos: Cancelamento', group: 'captura', balanceType: 'zero', createdAt: new Date(), updatedAt: new Date() },
  { id: 'slip_settlement', name: 'Boletos: Liquidação', group: 'liquidacao', balanceType: 'zero', createdAt: new Date(), updatedAt: new Date() },
  { id: 'slip_fee', name: 'Boletos: Tarifas', group: 'liquidacao', balanceType: 'zero', createdAt: new Date(), updatedAt: new Date() },
  { id: 'slip_balance', name: 'Boletos: Saldos em Aberto', group: 'saldos', balanceType: 'zero', createdAt: new Date(), updatedAt: new Date() },
  { id: 'creditcard_capture', name: 'Cartões: Captura', group: 'captura', balanceType: 'zero', createdAt: new Date(), updatedAt: new Date() },
  { id: 'creditcard_batches', name: 'Cartões: Resumos de Venda', group: 'captura', balanceType: 'zero', createdAt: new Date(), updatedAt: new Date() },
  { id: 'creditcard_settlement', name: 'Cartões: Liquidação', group: 'liquidacao', balanceType: 'zero', createdAt: new Date(), updatedAt: new Date() },
  { id: 'creditcard_balance', name: 'Cartões: Saldos em Aberto', group: 'saldos', balanceType: 'zero', createdAt: new Date(), updatedAt: new Date() },
  { id: 'direct_debit_capture', name: 'Débito Automático: Captura', group: 'captura', balanceType: 'zero', createdAt: new Date(), updatedAt: new Date() },
  { id: 'direct_debit_settlement', name: 'Débito Automático: Liquidação', group: 'liquidacao', balanceType: 'zero', createdAt: new Date(), updatedAt: new Date() },
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(tableName, content, {});
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete(tableName, null, {});
  }
};
