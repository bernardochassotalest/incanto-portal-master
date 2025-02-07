'use strict';

const bcrypt = require('bcrypt-nodejs');

const accountData = {
    active: true,
    name: 'Customer',
    email: 'customer@incanto.com',
    phoneNumber: '5574-7770',
    accountType: 'customer',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  profileData = {
    accountId: 2,
    active: true,
    name: 'Demo',
    permissions: 'B00;B01+W;A04+C',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  userData = {
    accountId: 2,
    profileId: 2,
    active: true,
    email: 'demo@incanto.com',
    name: 'Demonstração',
    avatar: '',
    confirmationToken: 'none',
    password: bcrypt.hashSync('SKL1979@!'),
    createdAt: new Date(),
    updatedAt: new Date()
  };

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.bulkInsert('accounts', [accountData], { transaction: t }),
        queryInterface.bulkInsert('profiles', [profileData], { transaction: t }),
        queryInterface.bulkInsert('users', [userData], { transaction: t }),
      ])
   })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.bulkDelete('accounts', null, { id: 2 }, { transaction: t }),
        queryInterface.bulkDelete('profiles', null, { id: 2 }, { transaction: t }),
        queryInterface.bulkDelete('users', null, { id: 2 }, { transaction: t }),
      ])
   })
  }
};
