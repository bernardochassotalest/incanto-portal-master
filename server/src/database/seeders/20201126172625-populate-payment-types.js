'use strict';

const tableName = 'paymentTypes'
const content = [
  { id: 'none', name: 'Não capturado', createdAt: new Date(), updatedAt: new Date() },
  { id: 'creditcard', name: 'Cartões', createdAt: new Date(), updatedAt: new Date() },
  { id: 'slip', name: 'Boleto', createdAt: new Date(), updatedAt: new Date() },
  { id: 'directDebit', name: 'Débito Automático', createdAt: new Date(), updatedAt: new Date() },
  { id: 'check', name: 'Cheque', createdAt: new Date(), updatedAt: new Date() },
  { id: 'money', name: 'Dinheiro', createdAt: new Date(), updatedAt: new Date() },
  { id: 'costs', name: 'Custos', createdAt: new Date(), updatedAt: new Date() },
  { id: 'invoice', name: 'Invoice (Cobrança Posterior)', createdAt: new Date(), updatedAt: new Date() },
  { id: 'billCredit', name: 'Crédito de Fatura Anterior', createdAt: new Date(), updatedAt: new Date() },
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(tableName, content, {});
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete(tableName, null, {});
  }
};

