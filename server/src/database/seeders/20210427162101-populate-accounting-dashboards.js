'use strict';

const tableName = 'accountingDashboards'
const content = [
  { id: '408caab7-75fb-4913-948f-e5462f7e3dff', group: 'pecld_provisao', type: 'pecld', visOrder: 1, factor: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: '10e702e6-ea0d-48e0-885a-7294b46cbc19', group: 'pecld_estorno', type: 'pecld', visOrder: 2, factor: -1, createdAt: new Date(), updatedAt: new Date() },
  { id: 'f21f0226-5ffa-432f-a2f3-268a018e2ad5', group: 'adq_cancelamento', type: 'canceled', visOrder: 1, factor: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 'c015ffeb-e912-4f15-8e66-6520a1e643a5', group: 'bnc_bol_cancelamento', type: 'canceled', visOrder: 2, factor: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 'c62a6819-01c7-4ef0-9222-f06371a86b98', group: 'bnc_deb_cancelamento', type: 'canceled', visOrder: 3, factor: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 'f3a4dc3b-7371-47c0-9f18-879f0f785aa7', group: 'crd_cancelamento', type: 'canceled', visOrder: 4, factor: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 'bf367721-e891-4675-b801-9bf8464a2039', group: 'lmb_cancelamento', type: 'canceled', visOrder: 5, factor: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: '4f4621d7-aa33-44e4-b902-d9a41816c5ad', group: 'bnc_bol_tarifa', type: 'fee', visOrder: 1, factor: 1, createdAt: new Date(), updatedAt: new Date() },
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(tableName, content, {});
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete(tableName, null, {});
  }
};
