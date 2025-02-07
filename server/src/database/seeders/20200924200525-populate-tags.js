'use strict';

const tableName = 'tags'
const content = [
  { tag: 'sep', createdAt: new Date(), updatedAt: new Date() },
  { tag: 'avanti', createdAt: new Date(), updatedAt: new Date() },
  { tag: 'bilheteria', createdAt: new Date(), updatedAt: new Date() },
  { tag: 'multiclubes', createdAt: new Date(), updatedAt: new Date() },
  { tag: 'licenciamento', createdAt: new Date(), updatedAt: new Date() },
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(tableName, content, {});
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete(tableName, null, {});
  }
};
