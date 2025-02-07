'use strict';

const tableName = 'acquirers'
const content = [
  { id: 'cielo', name: 'Cielo', createdAt: new Date(), updatedAt: new Date() },
  { id: 'stelo', name: 'Stelo', createdAt: new Date(), updatedAt: new Date() },
  { id: 'rede', name: 'Rede', createdAt: new Date(), updatedAt: new Date() },
  { id: 'elavon', name: 'Elavon', createdAt: new Date(), updatedAt: new Date() },
  { id: 'stone', name: 'Stone', createdAt: new Date(), updatedAt: new Date() },
  { id: 'getnet', name: 'GetNet', createdAt: new Date(), updatedAt: new Date() },
  { id: 'safrapay', name: 'SafraPay', createdAt: new Date(), updatedAt: new Date() },
  { id: 'bin', name: 'Bin', createdAt: new Date(), updatedAt: new Date() },
  { id: 'vero', name: 'Vero', createdAt: new Date(), updatedAt: new Date() }
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(tableName, content, {});
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete(tableName, null, {});
  }
};
