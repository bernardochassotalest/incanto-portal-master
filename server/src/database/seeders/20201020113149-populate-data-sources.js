'use strict';

const tableName = 'dataSources'
const content = [
    { id: 'vindi', name: 'Vindi - Avanti', mapping: 'Y', createdAt: new Date(), updatedAt: new Date() },
    { id: 'newc', name: 'NewC - Bilheteria', mapping: 'N', createdAt: new Date(), updatedAt: new Date() },
    { id: 'multiclubes', name: 'Multiclubes', mapping: 'Y', createdAt: new Date(), updatedAt: new Date() },
    { id: 'cielo', name: 'Cielo', mapping: 'N', createdAt: new Date(), updatedAt: new Date() },
    { id: 'rede', name: 'Rede', mapping: 'N', createdAt: new Date(), updatedAt: new Date() },
    { id: 'itau', name: 'Itaú', mapping: 'N', createdAt: new Date(), updatedAt: new Date() },
    { id: 'bradesco', name: 'Bradesco', mapping: 'N', createdAt: new Date(), updatedAt: new Date() },
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(tableName, content, {});
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete(tableName, null, {});
  }
};