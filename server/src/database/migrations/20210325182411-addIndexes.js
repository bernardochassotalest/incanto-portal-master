'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addIndex('sales', ['sourceDb', 'sourceId'], { name: 'salesIndex01' }, { transaction }),
        queryInterface.addIndex('saleAccountingBalances', ['saleAccountingId'], { name: 'saleAccountingBalancesIndex01' }, { transaction }),
        queryInterface.addIndex('customerCredits', ['sourceDb', 'sourceId'], { name: 'customerCreditsIndex01' }, { transaction }),
        queryInterface.addIndex('customerCredits', ['customerId'], { name: 'customerCreditsIndex02' }, { transaction }),
        queryInterface.addIndex('tickets', ['saleItemId'], { name: 'ticketsIndex01' }, { transaction }),
        queryInterface.addIndex('memberships', ['saleItemId'], { name: 'membershipsIndex01' }, { transaction }),
        queryInterface.addIndex('acquirerDisputes', ['saleId'], { name: 'acquirerDisputesIndex01' }, { transaction }),
        queryInterface.addIndex('acquirerRejections', ['saleId'], { name: 'acquirerRejectionsIndex01' }, { transaction }),
        queryInterface.addIndex('vindiCharges', ['billId'], { name: 'vindiChargesIndex01' }, { transaction }),
        queryInterface.addIndex('vindiTransactions', ['chargeId'], { name: 'vindiTransactionsIndex01' }, { transaction }),
        queryInterface.addIndex('vindiIssues', ['itemId'], { name: 'vindiIssuesIndex01' }, { transaction }),
      ])
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeIndex('sales', 'salesIndex01', { transaction }),
        queryInterface.removeIndex('saleAccountingBalances', 'saleAccountingBalancesIndex01', { transaction }),
        queryInterface.removeIndex('customerCredits', 'customerCreditsIndex01', { transaction }),
        queryInterface.removeIndex('customerCredits', 'customerCreditsIndex02', { transaction }),
        queryInterface.removeIndex('tickets', 'ticketsIndex01', { transaction }),
        queryInterface.removeIndex('memberships', 'membershipsIndex01', { transaction }),
        queryInterface.removeIndex('acquirerDisputes', 'acquirerDisputesIndex01', { transaction }),
        queryInterface.removeIndex('acquirerRejections', 'acquirerRejectionsIndex01', { transaction }),
        queryInterface.removeIndex('vindiCharges', 'vindiChargesIndex01', { transaction }),
        queryInterface.removeIndex('vindiTransactions', 'vindiTransactionsIndex01', { transaction }),
        queryInterface.removeIndex('vindiIssues', 'vindiIssuesIndex01', { transaction }),
      ]);
    });
  },
};
