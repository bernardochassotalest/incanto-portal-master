'use strict';

const tableName = 'pointOfSales'
const content = [
  { id: '5763e5a1aa128a5a76268f6972f04696', 'acquirer' : 'cielo', 'code' : '001018553425', 'tag' : 'avanti', createdAt: new Date(), updatedAt: new Date() },
  { id: '1938c2cc536b5eb7489188d7a7d927b6', 'acquirer' : 'cielo', 'code' : '001094750627', 'tag' : 'avanti', createdAt: new Date(), updatedAt: new Date() },
  { id: '94ca24c55d93902da17e30967063584c', 'acquirer' : 'cielo', 'code' : '001085009006', 'tag' : 'multiclubes', createdAt: new Date(), updatedAt: new Date() },
  { id: '2287ab8936fa974f4fad7feafad36c20', 'acquirer' : 'cielo', 'code' : '001089256598', 'tag' : 'multiclubes', createdAt: new Date(), updatedAt: new Date() },
  { id: 'af2f0c1a3ee53c9700443022b8231219', 'acquirer' : 'cielo', 'code' : '001095349411', 'tag' : 'multiclubes', createdAt: new Date(), updatedAt: new Date() },
  { id: 'f800945b7908a572aef23e9eb31bab6e', 'acquirer' : 'rede', 'code' : '000023017210', 'tag' : 'avanti', createdAt: new Date(), updatedAt: new Date() },
  { id: '3fcc37890c20b448d214838796d42551', 'acquirer' : 'rede', 'code' : '000050496620', 'tag' : 'bilheteria', createdAt: new Date(), updatedAt: new Date() },
  { id: 'd41c4ec5a5fe3baa33a04dd0e8c35676', 'acquirer' : 'rede', 'code' : '000068836147', 'tag' : 'bilheteria', createdAt: new Date(), updatedAt: new Date() },
  { id: '3babeba0f68a206624a3dc0055bc72f8', 'acquirer' : 'rede', 'code' : '000083065237', 'tag' : 'bilheteria', createdAt: new Date(), updatedAt: new Date() },
  { id: '954a29f7e6e8f75b6b18fbf3d43cad66', 'acquirer' : 'rede', 'code' : '000022766960', 'tag' : 'multiclubes', createdAt: new Date(), updatedAt: new Date() },
  { id: '6da637bdb3d60881630a01de29778349', 'acquirer' : 'rede', 'code' : '000062637940', 'tag' : 'sep', createdAt: new Date(), updatedAt: new Date() },
  { id: 'a9fac5e42cac203de26575d0b15a734f', 'acquirer' : 'stelo', 'code' : '001018553425', 'tag' : 'avanti', createdAt: new Date(), updatedAt: new Date() },
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(tableName, content, {});
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete(tableName, null, {});
  }
};
