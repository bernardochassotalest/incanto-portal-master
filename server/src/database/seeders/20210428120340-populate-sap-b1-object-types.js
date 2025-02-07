'use strict';

const tableName = 'sapB1ObjectTypes'
const content = [
  { id: '-1', name: 'Todas as Transações', foreign: 'All Transactions', createdAt: new Date(), updatedAt: new Date() },
  { id: '-2', name: 'Saldo Inicial Contábil', foreign: 'Opening Balance', createdAt: new Date(), updatedAt: new Date() },
  { id: '-3', name: 'Fechamento de Balanço', foreign: 'Closing Balance', createdAt: new Date(), updatedAt: new Date() },
  { id: '13', name: 'Nota Fiscal de Saída', foreign: 'A/R Invoice', createdAt: new Date(), updatedAt: new Date() },
  { id: '14', name: 'Devolução de Nota de Saída', foreign: 'A/R Credit Memo', createdAt: new Date(), updatedAt: new Date() },
  { id: '15', name: 'Entrega', foreign: 'Delivery', createdAt: new Date(), updatedAt: new Date() },
  { id: '16', name: 'Devolução', foreign: 'Returns', createdAt: new Date(), updatedAt: new Date() },
  { id: '18', name: 'Nota Fiscal de Entrada', foreign: 'A/P Invoice', createdAt: new Date(), updatedAt: new Date() },
  { id: '19', name: 'Devolução de Nota de Entrada', foreign: 'A/P Credit Memo', createdAt: new Date(), updatedAt: new Date() },
  { id: '20', name: 'Recebimento de Mercadorias', foreign: 'Goods Receipt PO', createdAt: new Date(), updatedAt: new Date() },
  { id: '21', name: 'Devolução de Mercadorias', foreign: 'Goods Return', createdAt: new Date(), updatedAt: new Date() },
  { id: '24', name: 'Contas a Receber', foreign: 'Incoming Payment', createdAt: new Date(), updatedAt: new Date() },
  { id: '25', name: 'Depósito', foreign: 'Deposit', createdAt: new Date(), updatedAt: new Date() },
  { id: '30', name: 'Lançamento Contábil', foreign: 'Journal Entry', createdAt: new Date(), updatedAt: new Date() },
  { id: '46', name: 'Contas a Pagar', foreign: 'Vendor Payment', createdAt: new Date(), updatedAt: new Date() },
  { id: '57', name: 'Cheques para Pagamento', foreign: 'Checks for Payment', createdAt: new Date(), updatedAt: new Date() },
  { id: '58', name: '', foreign: 'Inventory List', createdAt: new Date(), updatedAt: new Date() },
  { id: '59', name: 'Entrada de Mercadoria', foreign: 'Goods Receipt', createdAt: new Date(), updatedAt: new Date() },
  { id: '60', name: 'Saída de Mercadoria', foreign: 'Goods Issue', createdAt: new Date(), updatedAt: new Date() },
  { id: '67', name: 'Transferência do Estoque', foreign: 'Inventory Transfers', createdAt: new Date(), updatedAt: new Date() },
  { id: '68', name: '', foreign: 'Work Instructions', createdAt: new Date(), updatedAt: new Date() },
  { id: '69', name: '', foreign: 'Landed Costs', createdAt: new Date(), updatedAt: new Date() },
  { id: '76', name: '', foreign: 'Postdated Deposit', createdAt: new Date(), updatedAt: new Date() },
  { id: '132', name: '', foreign: 'Correction Invoice', createdAt: new Date(), updatedAt: new Date() },
  { id: '162', name: 'Reavaliação do Estoque', foreign: 'Inventory Valuation', createdAt: new Date(), updatedAt: new Date() },
  { id: '163', name: '', foreign: 'A/P Correction Invoice', createdAt: new Date(), updatedAt: new Date() },
  { id: '164', name: '', foreign: 'A/P Correction Invoice Reversal', createdAt: new Date(), updatedAt: new Date() },
  { id: '165', name: '', foreign: 'A/R Correction Invoice', createdAt: new Date(), updatedAt: new Date() },
  { id: '166', name: '', foreign: 'A/R Correction Invoice Reversal', createdAt: new Date(), updatedAt: new Date() },
  { id: '182', name: 'Boleto', foreign: 'BoE Transaction', createdAt: new Date(), updatedAt: new Date() },
  { id: '202', name: 'Ordem de Produção', foreign: 'Production Order', createdAt: new Date(), updatedAt: new Date() },
  { id: '203', name: 'Adiantamento de Contas a Receber', foreign: 'A/R Down Payment', createdAt: new Date(), updatedAt: new Date() },
  { id: '204', name: 'Adiantamento de Contas a Pagar', foreign: 'A/P Down Payment', createdAt: new Date(), updatedAt: new Date() },
  { id: '281', name: '', foreign: 'A/P Tax Invoice', createdAt: new Date(), updatedAt: new Date() },
  { id: '321', name: 'Reconciliação Interna', foreign: 'Internal Reconciliation', createdAt: new Date(), updatedAt: new Date() },
  { id: '10000046', name: '', foreign: 'Data Archive', createdAt: new Date(), updatedAt: new Date() },
  { id: '10000071', name: '', foreign: 'Inventory Posting', createdAt: new Date(), updatedAt: new Date() },
  { id: '10000079', name: '', foreign: 'TDS Adjustment', createdAt: new Date(), updatedAt: new Date() },
  { id: '140000009', name: '', foreign: 'Outgoing Excise Invoice', createdAt: new Date(), updatedAt: new Date() },
  { id: '140000010', name: '', foreign: 'Incoming Excise Invoice', createdAt: new Date(), updatedAt: new Date() },
  { id: '254000061', name: '', foreign: 'Input Service Distribution Invoice', createdAt: new Date(), updatedAt: new Date() },
  { id: '254000062', name: '', foreign: 'Input Service Distribution Recipient Invoice', createdAt: new Date(), updatedAt: new Date() },
  { id: '254000063', name: '', foreign: 'Input Service Distribution Credit Memo', createdAt: new Date(), updatedAt: new Date() },
  { id: '254000064', name: '', foreign: 'Input Service Distribution Recipient Credit Memo', createdAt: new Date(), updatedAt: new Date() },
  { id: '254000065', name: '', foreign: 'Self Invoice', createdAt: new Date(), updatedAt: new Date() },
  { id: '254000066', name: '', foreign: 'Self Credit Memo', createdAt: new Date(), updatedAt: new Date() },
  { id: '310000001', name: 'Saldo Inicial de Estoque', foreign: 'Inventory Opening Balance', createdAt: new Date(), updatedAt: new Date() },
  { id: '1470000049', name: 'Ativo Fixo - Capitalização', foreign: 'Fixed Asset Capitalization', createdAt: new Date(), updatedAt: new Date() },
  { id: '1470000060', name: 'Ativo Fixo - Capitalização Reversão', foreign: 'Fixed Asset Capitalization Credit Memo', createdAt: new Date(), updatedAt: new Date() },
  { id: '1470000071', name: 'Ativo Fixo - Execução da Depreciação', foreign: 'Fixed Asset Depreciation Run', createdAt: new Date(), updatedAt: new Date() },
  { id: '1470000075', name: 'Ativo Fixo - Depreciação Manual', foreign: 'Fixed Asset Manual Depreciation', createdAt: new Date(), updatedAt: new Date() },
  { id: '1470000085', name: 'Ativo Fixo - Reavaliação', foreign: 'Fixed Asset Revaluation', createdAt: new Date(), updatedAt: new Date() },
  { id: '1470000090', name: 'Ativo Fixo - Transferência', foreign: 'Fixed Asset Transfer', createdAt: new Date(), updatedAt: new Date() },
  { id: '1470000094', name: 'Ativo Fixo - Baixa', foreign: 'Fixed Asset Retirement', createdAt: new Date(), updatedAt: new Date() },
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(tableName, content, {});
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete(tableName, null, {});
  }
};
