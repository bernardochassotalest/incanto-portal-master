'use strict';

const tableName = 'sourceItems'
const content = [
    { source: 'vindi', id: 'mensalidade', name: 'Mensalidades', createdAt: new Date(), updatedAt: new Date() },
    { source: 'vindi', id: 'adesao', name: 'Taxa de Adesão', createdAt: new Date(), updatedAt: new Date() },
    { source: 'vindi', id: 'carteirinha', name: 'Carteirinha', createdAt: new Date(), updatedAt: new Date() },
    { source: 'vindi', id: 'financeiro', name: 'Financeiro', createdAt: new Date(), updatedAt: new Date() },
    { source: 'newc', id: 'NEWC-001', name: 'Campeonato Paulista', createdAt: new Date(), updatedAt: new Date() },
    { source: 'newc', id: 'NEWC-002', name: 'Campeonato Brasileiro', createdAt: new Date(), updatedAt: new Date() },
    { source: 'newc', id: 'NEWC-003', name: 'Copa Libertadores', createdAt: new Date(), updatedAt: new Date() },
    { source: 'newc', id: 'NEWC-004', name: 'Copa do Brasil', createdAt: new Date(), updatedAt: new Date() },
    { source: 'newc', id: 'NEWC-005', name: 'Copa Sul - Americana', createdAt: new Date(), updatedAt: new Date() },
    { source: 'newc', id: 'NEWC-006', name: 'Jogos Amistosos', createdAt: new Date(), updatedAt: new Date() },
    { source: 'newc', id: 'NEWC-007', name: 'Teste de Catracas', createdAt: new Date(), updatedAt: new Date() },
    { source: 'newc', id: 'NEWC-011', name: 'Campeonato Brasileiro', createdAt: new Date(), updatedAt: new Date() },
    { source: 'newc', id: 'NEWC-020', name: 'Campeonato Brasileiro Sub-17', createdAt: new Date(), updatedAt: new Date() },
    { source: 'newc', id: 'NEWC-099', name: 'Testes', createdAt: new Date(), updatedAt: new Date() },
    { source: 'newc', id: 'NEWC-0XX', name: 'Teste para FPF', createdAt: new Date(), updatedAt: new Date() },
    { source: 'multiclubes', id: 'armarios', name: 'Armários', createdAt: new Date(), updatedAt: new Date() },
    { source: 'multiclubes', id: 'arrecadacao_social', name: 'Arrecadação Social', createdAt: new Date(), updatedAt: new Date() },
    { source: 'multiclubes', id: 'aulas', name: 'Aulas', createdAt: new Date(), updatedAt: new Date() },
    { source: 'multiclubes', id: 'ballet', name: 'Ballet', createdAt: new Date(), updatedAt: new Date() },
    { source: 'multiclubes', id: 'eventos_sociais', name: 'Eventos Sociais', createdAt: new Date(), updatedAt: new Date() },
    { source: 'multiclubes', id: 'eventuais', name: 'Eventuais', createdAt: new Date(), updatedAt: new Date() },
    { source: 'multiclubes', id: 'exames_medicos', name: 'Exames Médicos  / Fisioterapia', createdAt: new Date(), updatedAt: new Date() },
    { source: 'multiclubes', id: 'sauna_massagem', name: 'Sauna / Massagem', createdAt: new Date(), updatedAt: new Date() },
    { source: 'multiclubes', id: 'taxa_mensalidades', name: 'Taxas de Mensalidades de Atividades Esportivas', createdAt: new Date(), updatedAt: new Date() },
    { source: 'multiclubes', id: 'taxa_visitantes', name: 'Taxas de Visitantes', createdAt: new Date(), updatedAt: new Date() },
    { source: 'multiclubes', id: 'taxas_utilizacao', name: 'Taxas de Utilização de Quadras / Campos', createdAt: new Date(), updatedAt: new Date() },
    { source: 'cielo', id: 'avanti', name: 'Avanti', createdAt: new Date(), updatedAt: new Date() },
    { source: 'cielo', id: 'multiclubes', name: 'Multiclubes', createdAt: new Date(), updatedAt: new Date() },
    { source: 'rede', id: 'avanti', name: 'Avanti', createdAt: new Date(), updatedAt: new Date() },
    { source: 'rede', id: 'bilheteria', name: 'Bilheteria', createdAt: new Date(), updatedAt: new Date() },
    { source: 'rede', id: 'multiclubes', name: 'Multiclubes', createdAt: new Date(), updatedAt: new Date() },
    { source: 'itau', id: 'avanti', name: 'Avanti', createdAt: new Date(), updatedAt: new Date() },
    { source: 'itau', id: 'multiclubes', name: 'Multiclubes', createdAt: new Date(), updatedAt: new Date() },
    { source: 'itau', id: 'licenciamento', name: 'Licenciamento', createdAt: new Date(), updatedAt: new Date() },
    { source: 'bradesco', id: 'multiclubes', name: 'Multiclubes', createdAt: new Date(), updatedAt: new Date() },
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(tableName, content, {});
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete(tableName, null, {});
  }
};
