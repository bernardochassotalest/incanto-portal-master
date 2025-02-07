'use strict';

const tableName = 'reportTypes'
const content = [
  { id: 'nao-conciliadas', name: 'Conciliação: Transações Não Conciliadas', createdAt: new Date(), updatedAt: new Date() },
  { id: 'conciliado-manual', name: 'Conciliação: Transações Conciliadas Manualmente', createdAt: new Date(), updatedAt: new Date() },
  { id: 'detalhes-lcm', name: 'Contabilização: Detalhamento', createdAt: new Date(), updatedAt: new Date() },
  { id: 'historico-faturas', name: 'Faturas: Histórico Contábil', createdAt: new Date(), updatedAt: new Date() },
  { id: 'saldo-faturas', name: 'Faturas: Saldos de Faturamento/Não Captura', createdAt: new Date(), updatedAt: new Date() },
  { id: 'saldos-abertos', name: 'Faturas: Saldos em Aberto', createdAt: new Date(), updatedAt: new Date() },
  { id: 'creditos-clientes', name: 'Créditos: Saldos de Clientes', createdAt: new Date(), updatedAt: new Date() },
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(tableName, content, {});
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete(tableName, null, {});
  }
};

