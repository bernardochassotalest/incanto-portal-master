'use strict';

const bcrypt = require('bcrypt-nodejs');

const accountData = {
    active: true,
    name: 'System',
    email: 'admin@incanto.com',
    phoneNumber: '5574-7770',
    accountType: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  profileData = {
    accountId: 1,
    active: true,
    name: 'Administrador',
    permissions: 'A01+W;A02+W;A03;A04;A05;A06;A07;A08;A09;',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  userData = {
    accountId: 1,
    profileId: 1,
    active: true,
    email: 'admin@incanto.com',
    name: 'Administrador',
    avatar: '',
    confirmationToken: 'none',
    password: bcrypt.hashSync('SKL1979@!'),
    createdAt: new Date(),
    updatedAt: new Date()
  }

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkInsert('accounts', [accountData], { transaction }),
        queryInterface.bulkInsert('profiles', [profileData], { transaction }),
        queryInterface.bulkInsert('users', [userData], { transaction })
      ])
   })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkDelete('accounts', null, { id: 1 }, { transaction }),
        queryInterface.bulkDelete('profiles', null, { id: 1 }, { transaction }),
        queryInterface.bulkDelete('users', null, { id: 1 }, { transaction })
      ])
   })
  }
};
