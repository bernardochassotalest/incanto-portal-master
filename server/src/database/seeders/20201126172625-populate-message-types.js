'use strict';

const tableName = 'messageTypes'
const content = [
  { id: 'accountingConfig', name: 'Configuração não ativada', createdAt: new Date(), updatedAt: new Date() },
  { id: 'itemMapping', name: 'Mapeamento do Item não foi encontrado', createdAt: new Date(), updatedAt: new Date() },
  { id: 'sapB1Error', name: 'Erro na comunicação com o SAP Business One', createdAt: new Date(), updatedAt: new Date() },
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(tableName, content, {});
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete(tableName, null, {});
  }
};

