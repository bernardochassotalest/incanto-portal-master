'use strict';

const tableName = 'accountingModelGroups'
const content = [
  { id: 'rct_provisao', 'name' : 'Receitas: Reconhecimento', visOrder: 10001, createdAt: new Date(), updatedAt: new Date() },
  { id: 'adq_captura', 'name' : 'Cartão de Crédito: Captura', visOrder: 10002, createdAt: new Date(), updatedAt: new Date() },
  { id: 'bnc_bol_captura', 'name' : 'Banco - Boleto: Captura', visOrder: 10003, createdAt: new Date(), updatedAt: new Date() },
  { id: 'bnc_bol_cancelamento', 'name' : 'Banco - Boleto: Cancelamento', visOrder: 10004, createdAt: new Date(), updatedAt: new Date() },
  { id: 'bnc_bol_tarifa', 'name' : 'Banco - Boleto: Tarifa', visOrder: 10005, createdAt: new Date(), updatedAt: new Date() },
  { id: 'bnc_deb_captura', 'name' : 'Banco - Débito Automático: Captura', visOrder: 10006, createdAt: new Date(), updatedAt: new Date() },
  { id: 'bnc_deb_cancelamento', 'name' : 'Banco - Débito Automático: Cancelamento', visOrder: 10007, createdAt: new Date(), updatedAt: new Date() },
  { id: 'crd_captura', 'name' : 'Crédito: Captura (Utilização do Crédito)', visOrder: 10008, createdAt: new Date(), updatedAt: new Date() },
  { id: 'crd_duplicidade', 'name' : 'Crédito: Pagamentos em Duplicidade', visOrder: 10009, createdAt: new Date(), updatedAt: new Date() },
  { id: 'crd_cancelamento', 'name' : 'Crédito: Cancelamento da Captura', visOrder: 10010, createdAt: new Date(), updatedAt: new Date() },
  { id: 'lmb_provisao', 'name' : 'Não Capturado: Provisão', visOrder: 20001, createdAt: new Date(), updatedAt: new Date() },
  { id: 'lmb_to_boleto', 'name' : 'Não Capturado: Transferência para Boleto', visOrder: 20002, createdAt: new Date(), updatedAt: new Date() },
  { id: 'lmb_to_debito', 'name' : 'Não Capturado: Transferência para Débito Automático', visOrder: 20003, createdAt: new Date(), updatedAt: new Date() },
  { id: 'lmb_to_cartao', 'name' : 'Não Capturado: Transferência para Cartão', visOrder: 20004, createdAt: new Date(), updatedAt: new Date() },
  { id: 'lmb_cancelamento', 'name' : 'Não Capturado: Cancelamento', visOrder: 20005, createdAt: new Date(), updatedAt: new Date() },
  { id: 'bnc_bol_liquidacao', 'name' : 'Banco - Boleto: Liquidação', visOrder: 30001, createdAt: new Date(), updatedAt: new Date() },
  { id: 'bnc_deb_liquidacao', 'name' : 'Banco - Débito Automático: Liquidação', visOrder: 30002, createdAt: new Date(), updatedAt: new Date() },
  { id: 'adq_liquidacao', 'name' : 'Cartão de Crédito: Liquidação', visOrder: 30003, createdAt: new Date(), updatedAt: new Date() },
  { id: 'adq_antecipacao', 'name' : 'Cartão de Crédito: Antecipação', visOrder: 30004, createdAt: new Date(), updatedAt: new Date() },
  { id: 'adq_cancelamento', 'name' : 'Cartão de Crédito: Cancelamento de Venda', visOrder: 30005, createdAt: new Date(), updatedAt: new Date() },
  { id: 'adq_chargeback', 'name' : 'Cartão de Crédito: Chargeback', visOrder: 30006, createdAt: new Date(), updatedAt: new Date() },
  { id: 'adq_aluguel_equipamentos', 'name' : 'Cartão de Crédito: Aluguel de Equipamentos', visOrder: 30007, createdAt: new Date(), updatedAt: new Date() },
  { id: 'adq_ajuste_a_credito', 'name' : 'Cartão de Crédito: Ajuste a Crédito', visOrder: 30008, createdAt: new Date(), updatedAt: new Date() },
  { id: 'adq_ajuste_a_debito', 'name' : 'Cartão de Crédito: Ajuste a Débito', visOrder: 30009, createdAt: new Date(), updatedAt: new Date() },
  { id: 'pecld_provisao', 'name' : 'PECLD: Provisão', visOrder: 40001, createdAt: new Date(), updatedAt: new Date() },
  { id: 'pecld_estorno', 'name' : 'PECLD: Estorno', visOrder: 40002, createdAt: new Date(), updatedAt: new Date() },
  { id: 'adq_saldo_inicial', 'name' : 'Cartão de Crédito: Saldo Inicial', visOrder: 50001, createdAt: new Date(), updatedAt: new Date() },
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(tableName, content, {});
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete(tableName, null, {});
  }
};
