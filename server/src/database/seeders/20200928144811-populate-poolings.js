'use strict';

const tableName = 'poolings'
const content = [
  { id: 'sapb1-costing-center', periodType: 'daily', 'startDate': '1900-01-01', 'startCycle': '', 'lastExecution': '', createdAt: new Date(), updatedAt: new Date() },
  { id: 'sapb1-projects', periodType: 'daily', 'startDate': '1900-01-01', 'startCycle': '', 'lastExecution': '', createdAt: new Date(), updatedAt: new Date() },
  { id: 'sapb1-chart-of-account', periodType: 'daily', 'startDate': '1900-01-01', 'startCycle': '', 'lastExecution': '', createdAt: new Date(), updatedAt: new Date() },
  { id: 'sapb1-business-partners', periodType: 'daily', 'startDate': '1900-01-01', 'startCycle': '', 'lastExecution': '', createdAt: new Date(), updatedAt: new Date() },
  { id: 'multiclubes-sales', periodType: 'daily', 'startDate': '2020-12-01', 'startCycle': '', 'lastExecution': '', createdAt: new Date(), updatedAt: new Date() },
  { id: 'multiclubes-payments', periodType: 'daily', 'startDate': '2020-12-01', 'startCycle': '', 'lastExecution': '', createdAt: new Date(), updatedAt: new Date() },
  { id: 'vindi-customers', periodType: 'daily', 'startDate': '2020-08-01', 'startCycle': '', 'lastExecution': '', createdAt: new Date(), updatedAt: new Date() },
  { id: 'vindi-products', periodType: 'daily', 'startDate': '2000-01-01', 'startCycle': '', 'lastExecution': '', createdAt: new Date(), updatedAt: new Date() },
  { id: 'vindi-bills', periodType: 'daily', 'startDate': '2020-12-01', 'startCycle': '', 'lastExecution': '', createdAt: new Date(), updatedAt: new Date() },
  { id: 'vindi-transactions', periodType: 'daily', 'startDate': '2020-12-01', 'startCycle': '', 'lastExecution': '', createdAt: new Date(), updatedAt: new Date() },
  { id: 'vindi-issues', periodType: 'daily', 'startDate': '2020-12-01', 'startCycle': '', 'lastExecution': '', createdAt: new Date(), updatedAt: new Date() },
  { id: 'newc-products', periodType: 'monthly', 'startDate': '2011-05-01', 'startCycle': '', 'lastExecution': '', createdAt: new Date(), updatedAt: new Date() },
  { id: 'newc-clients', periodType: 'monthly', 'startDate': '2011-05-01', 'startCycle': '', 'lastExecution': '', createdAt: new Date(), updatedAt: new Date() },
  { id: 'newc-transactions', periodType: 'daily', 'startDate': '2020-12-01', 'startCycle': '', 'lastExecution': '', createdAt: new Date(), updatedAt: new Date() }
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(tableName, content, {});
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete(tableName, null, {});
  }
};
