'use strict';

const tableName = 'accountingDashboards'
const content = [
  { id: '7057bd97-d5e1-4a2c-aff2-cbf21f75fc6c', group: 'adq_captura', type: 'creditCard', visOrder: 1, factor: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 'f7e3df27-1fe8-45b2-96c0-b0a54cf1e91c', group: 'lmb_to_cartao', type: 'creditCard', visOrder: 2, factor: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: '3f179bb5-7c64-408f-b227-4fcd07192ac4', group: 'adq_liquidacao', type: 'creditCard', visOrder: 3, factor: -1, createdAt: new Date(), updatedAt: new Date() },
  { id: '45bdde9a-78ed-472e-8849-2ed5038845d3', group: 'adq_antecipacao', type: 'creditCard', visOrder: 4, factor: -1, createdAt: new Date(), updatedAt: new Date() },
  { id: '89393a4b-a01a-454b-acfd-91e59905d5f5', group: 'adq_cancelamento', type: 'creditCard', visOrder: 5, factor: -1, createdAt: new Date(), updatedAt: new Date() },
  { id: 'ab482340-f96b-46c4-a706-2bb47e78b68a', group: 'adq_ajuste_a_debito', type: 'creditCard', visOrder: 6, factor: -1, createdAt: new Date(), updatedAt: new Date() },
  { id: '0d6076db-ebd9-4b9f-9235-0617d2fb645d', group: 'bnc_bol_captura', type: 'slip', visOrder: 1, factor: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 'aeb7d992-06b0-4480-a2bb-2eaf029a4f7c', group: 'lmb_to_boleto', type: 'slip', visOrder: 2, factor: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: '802cb722-3c2b-4918-ba2c-6d8cd53a98e8', group: 'bnc_bol_liquidacao', type: 'slip', visOrder: 3, factor: -1, createdAt: new Date(), updatedAt: new Date() },
  { id: '16a79fda-5c3a-47c7-9404-71467edfcabb', group: 'bnc_bol_cancelamento', type: 'slip', visOrder: 4, factor: -1, createdAt: new Date(), updatedAt: new Date() },
  { id: 'f695c3ce-eafc-4dd3-a59b-4da35976454b', group: 'bnc_deb_captura', type: 'directDebit', visOrder: 1, factor: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: '71cb93e8-d26a-4faa-b399-30f255eb178a', group: 'lmb_to_debito', type: 'directDebit', visOrder: 2, factor: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 'c4fd0150-e55c-49ea-86bc-01c1dc55351c', group: 'bnc_deb_liquidacao', type: 'directDebit', visOrder: 3, factor: -1, createdAt: new Date(), updatedAt: new Date() },
  { id: '606e4e73-b1fa-40ee-9835-440025b4e551', group: 'bnc_deb_cancelamento', type: 'directDebit', visOrder: 4, factor: -1, createdAt: new Date(), updatedAt: new Date() },
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(tableName, content, {});
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete(tableName, null, {});
  }
};
