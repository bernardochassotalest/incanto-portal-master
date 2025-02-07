'use strict';

const tableName = 'accountingModels'
const content = [
  { group: 'rct_provisao', id: 'rct_provisao', 'name' : 'Receitas: Reconhecimento', baseMemo: 'VLR REF. PROVISÃO DE VENDAS', createdAt: new Date(), updatedAt: new Date() },
  { group: 'adq_captura', id: 'adq_captura', 'name' : 'Cartão de Crédito: Captura', baseMemo: 'VLR REF.PROV.VENDAS NO CARTÃO', createdAt: new Date(), updatedAt: new Date() },
  { group: 'adq_captura', id: 'adq_taxa_administracao', 'name' : 'Cartão de Crédito: Taxa de Administração', baseMemo: 'VLR REF. TAXA DE ADMINISTRAÇÃO', createdAt: new Date(), updatedAt: new Date() },
  { group: 'adq_liquidacao', id: 'adq_liquidacao', 'name' : 'Cartão de Crédito: Liquidação', baseMemo: 'VLR REF.RECEB.VENDAS CARTÃO', createdAt: new Date(), updatedAt: new Date() },
  { group: 'adq_antecipacao', id: 'adq_antecipacao', 'name' : 'Cartão de Crédito: Antecipação', baseMemo: 'VLR REF.RECEB.VENDAS CARTÃO', createdAt: new Date(), updatedAt: new Date() },
  { group: 'adq_antecipacao', id: 'adq_taxa_antecipacao', 'name' : 'Cartão de Crédito: Taxa de Antecipação', baseMemo: 'VLR REF.TAXA DE ANTECIPAÇÃO', createdAt: new Date(), updatedAt: new Date() },
  { group: 'adq_cancelamento', id: 'adq_canc_captura', 'name' : 'Cartão de Crédito: Cancelamento de Venda - Captura', baseMemo: 'VLR REF. CANCELAMENTO', createdAt: new Date(), updatedAt: new Date() },
  { group: 'adq_cancelamento', id: 'adq_canc_taxa_adm', 'name' : 'Cartão de Crédito: Cancelamento de Venda - Taxa de Administração', baseMemo: 'VLR REF. CANCELAMENTO', createdAt: new Date(), updatedAt: new Date() },
  { group: 'adq_chargeback', id: 'adq_chargeback', 'name' : 'Cartão de Crédito: Chargeback', baseMemo: 'VLR REF. CHARGEBACK', createdAt: new Date(), updatedAt: new Date() },
  { group: 'adq_liquidacao', id: 'adq_aluguel_equipamentos', 'name' : 'Cartão de Crédito: Aluguel de Equipamentos', baseMemo: 'VLR REF.DESCONTO ALUGUEL POS', createdAt: new Date(), updatedAt: new Date() },
  { group: 'adq_ajuste_a_credito', id: 'adq_ajuste_a_credito', 'name' : 'Cartão de Crédito: Ajuste a Crédito', baseMemo: 'VLR REF. OUTROS AJUSTES', createdAt: new Date(), updatedAt: new Date() },
  { group: 'adq_liquidacao', id: 'adq_ajuste_a_debito', 'name' : 'Cartão de Crédito: Ajuste a Débito', baseMemo: 'VLR REF. OUTROS AJUSTES', createdAt: new Date(), updatedAt: new Date() },
  { group: 'adq_saldo_inicial', id: 'adq_saldo_inicial', 'name' : 'Cartão de Crédito: Saldo Inicial', baseMemo: 'VLR REF.SALDO INICIAL DE CARTÃO', createdAt: new Date(), updatedAt: new Date() },
  { group: 'bnc_bol_captura', id: 'bnc_bol_captura', 'name' : 'Banco - Boleto: Captura', baseMemo: 'VLR REF.PROV.VENDAS NO BOLETO', createdAt: new Date(), updatedAt: new Date() },
  { group: 'bnc_bol_liquidacao', id: 'bnc_bol_liquidacao', 'name' : 'Banco - Boleto: Liquidação', baseMemo: 'VLR REF.RECEB.VENDAS NO BOLETO', createdAt: new Date(), updatedAt: new Date() },
  { group: 'bnc_bol_cancelamento', id: 'bnc_bol_cancelamento', 'name' : 'Banco - Boleto: Cancelamento', baseMemo: 'VLR REF.CANCELAMENTO NO BOLETO', createdAt: new Date(), updatedAt: new Date() },
  { group: 'bnc_bol_tarifa', id: 'bnc_bol_tarifa', 'name' : 'Banco - Boleto: Tarifa', baseMemo: 'VLR REF.TARIFAS DE BOLETOS', createdAt: new Date(), updatedAt: new Date() },
  { group: 'bnc_deb_captura', id: 'bnc_deb_captura', 'name' : 'Banco - Débito Automático: Captura', baseMemo: 'VLR REF. PROV. VENDAS DÉB.AUTOMÁTICO', createdAt: new Date(), updatedAt: new Date() },
  { group: 'bnc_deb_liquidacao', id: 'bnc_deb_liquidacao', 'name' : 'Banco - Débito Automático: Liquidação', baseMemo: 'VLR REF.RECEB.VENDAS DÉB.AUTOMÁTICO', createdAt: new Date(), updatedAt: new Date() },
  { group: 'bnc_deb_cancelamento', id: 'bnc_deb_cancelamento', 'name' : 'Banco - Débito Automático: Cancelamento', baseMemo: 'VLR REF.CANCELAMENTO DÉB.AUTOMÁTICO', createdAt: new Date(), updatedAt: new Date() },
  { group: 'pecld_provisao', id: 'pecld_provisao', 'name' : 'PECLD: Provisão', baseMemo: 'VLR REF. PROVISÃO DE PECLD', createdAt: new Date(), updatedAt: new Date() },
  { group: 'pecld_estorno', id: 'pecld_estorno', 'name' : 'PECLD: Estorno', baseMemo: 'VLR REF. ESTORNO DE PECLD', createdAt: new Date(), updatedAt: new Date() },
  { group: 'lmb_provisao', id: 'lmb_provisao', 'name' : 'Não Capturado: Provisão', baseMemo: 'VLR REF. PROVISÃO DE NÃO CAPTURA', createdAt: new Date(), updatedAt: new Date() },
  { group: 'lmb_to_boleto', id: 'lmb_to_boleto', 'name' : 'Não Capturado: Transferência para Boleto', baseMemo: 'VLR REF.TRANSFERÊNCIA P/BOLETO', createdAt: new Date(), updatedAt: new Date() },
  { group: 'lmb_to_debito', id: 'lmb_to_debito', 'name' : 'Não Capturado: Transferência para Débito Automático', baseMemo: 'VLR REF.TRANSF.P/DEB.AUTOMÁTICO', createdAt: new Date(), updatedAt: new Date() },
  { group: 'lmb_to_cartao', id: 'lmb_to_cartao_captura', 'name' : 'Não Capturado: Transferência para Cartão - Captura', baseMemo: 'VLR REF.TRANSFERÊNCIA P/CARTÃO', createdAt: new Date(), updatedAt: new Date() },
  { group: 'lmb_to_cartao', id: 'lmb_to_cartao_taxa_adm', 'name' : 'Não Capturado: Transferência para Cartão - Taxa de Administração', baseMemo: 'VLR REF.TRANSFERÊNCIA P/CARTÃO', createdAt: new Date(), updatedAt: new Date() },
  { group: 'lmb_cancelamento', id: 'lmb_cancelamento', 'name' : 'Não Capturado: Cancelamento', baseMemo: 'VLR REF.CANCELAMENTO NÃO CAPTURA', createdAt: new Date(), updatedAt: new Date() },
  { group: 'crd_captura', id: 'crd_captura', 'name' : 'Crédito: Captura (Utilização do Crédito)', baseMemo: 'VLR REF.PROV.VENDAS DE CRÉDITO', createdAt: new Date(), updatedAt: new Date() },
  { group: 'crd_duplicidade', id: 'crd_duplicidade', 'name' : 'Crédito: Pagamentos em Duplicidade', baseMemo: 'VLR REF.PAGTOS EM DUPLICIDADE', createdAt: new Date(), updatedAt: new Date() },
  { group: 'crd_cancelamento', id: 'crd_cancelamento', 'name' : 'Crédito: Cancelamento da Captura', baseMemo: 'VLR REF.CANCELAMENTO DE CRÉDITO', createdAt: new Date(), updatedAt: new Date() },
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(tableName, content, {});
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete(tableName, null, {});
  }
};
