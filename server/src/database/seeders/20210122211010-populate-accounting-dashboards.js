'use strict';

const tableName = 'accountingDashboards'
const content = [
  { id: '050a34ad-4b9a-42fb-bb9a-699a2a4e286e', group: 'rct_provisao', type: 'invoiced', visOrder: 1, factor: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 'a3955d4c-7794-4f1b-8e83-a999692f35d2', group: 'adq_captura', type: 'invoiced', visOrder: 2, factor: -1, createdAt: new Date(), updatedAt: new Date() },
  { id: '0f6fab21-d326-4cb9-948c-148dce2db80d', group: 'bnc_bol_captura', type: 'invoiced', visOrder: 3, factor: -1, createdAt: new Date(), updatedAt: new Date() },
  { id: '3f6ee740-3e33-4f53-a948-5288e3cba82d', group: 'bnc_bol_cancelamento', type: 'invoiced', visOrder: 4, factor: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: '9bc3630e-7b40-475b-8e54-8e0a4c80bb5c', group: 'bnc_deb_captura', type: 'invoiced', visOrder: 5, factor: -1, createdAt: new Date(), updatedAt: new Date() },
  { id: 'f229bcb7-f42f-4f90-91ef-681a5ff7059e', group: 'bnc_deb_cancelamento', type: 'invoiced', visOrder: 6, factor: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: '2fd55229-6d70-44c5-962e-b40bcf1ade0e', group: 'lmb_provisao', type: 'invoiced', visOrder: 7, factor: -1, createdAt: new Date(), updatedAt: new Date() },
  { id: '07f0ae85-6d5c-46a2-9c6d-b57b35a9f5c3', group: 'crd_captura', type: 'invoiced', visOrder: 8, factor: -1, createdAt: new Date(), updatedAt: new Date() },
  { id: '01d60129-bf17-4768-b8d8-79449f752c85', group: 'crd_cancelamento', type: 'invoiced', visOrder: 9, factor: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: '8ec7252d-1a66-4e34-a27d-9bee20fa6194', group: 'lmb_provisao', type: 'notCaptured', visOrder: 1, factor: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 'dbd7e68d-47cb-4f8c-837d-2f6b1af95654', group: 'lmb_to_boleto', type: 'notCaptured', visOrder: 2, factor: -1, createdAt: new Date(), updatedAt: new Date() },
  { id: '1d9e0f18-1597-4b19-93de-d02497531bdf', group: 'lmb_to_debito', type: 'notCaptured', visOrder: 3, factor: -1, createdAt: new Date(), updatedAt: new Date() },
  { id: '78e386ca-ad98-44d0-814d-56587c497d3c', group: 'lmb_to_cartao', type: 'notCaptured', visOrder: 4, factor: -1, createdAt: new Date(), updatedAt: new Date() },
  { id: '902581ad-3498-4f43-910d-27ec0ae6f75e', group: 'lmb_cancelamento', type: 'notCaptured', visOrder: 5, factor: -1, createdAt: new Date(), updatedAt: new Date() },
  { id: 'e2cb304e-763d-41b3-b1d2-bb95a586ca74', group: 'bnc_bol_liquidacao', type: 'settlement', visOrder: 1, factor: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 'ea21afa4-ad4e-44d9-98e9-7c89794abe34', group: 'bnc_deb_liquidacao', type: 'settlement', visOrder: 2, factor: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 'ffa4cb22-6330-44de-826a-2d4cab73b72d', group: 'adq_liquidacao', type: 'settlement', visOrder: 3, factor: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: '9cd4a07f-6489-478e-bf2d-97465e1ef5c2', group: 'adq_antecipacao', type: 'settlement', visOrder: 4, factor: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: '5fe990c8-34bc-4d09-8467-bec6b7108356', group: 'adq_aluguel_equipamentos', type: 'settlement', visOrder: 5, factor: -1, createdAt: new Date(), updatedAt: new Date() },
  { id: '20793034-bded-4b9b-8d00-b91c7d77d790', group: 'adq_cancelamento', type: 'settlement', visOrder: 6, factor: -1, createdAt: new Date(), updatedAt: new Date() },
  { id: '279f17bf-888d-46b9-8dd2-61daab7552b6', group: 'adq_chargeback', type: 'settlement', visOrder: 7, factor: -1, createdAt: new Date(), updatedAt: new Date() },
  { id: 'b707c173-675f-4ee6-afef-dab644f94d80', group: 'adq_ajuste_a_credito', type: 'settlement', visOrder: 8, factor: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 'a274a1af-ccca-4b8d-9697-c72e30ad679a', group: 'adq_ajuste_a_debito', type: 'settlement', visOrder: 9, factor: -1, createdAt: new Date(), updatedAt: new Date() },
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(tableName, content, {});
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete(tableName, null, {});
  }
};
