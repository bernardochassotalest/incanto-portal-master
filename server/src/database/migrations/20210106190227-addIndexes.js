'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addIndex('accountingItems', ['sourceDb', 'sourceId'], { name: 'accountingItemsIndex01' }, { transaction }),
        queryInterface.addIndex('accountingItems', ['sourceDb', 'jeId'], { name: 'accountingItemsIndex02' }, { transaction }),
        queryInterface.addIndex('accountingItems', ['jeId'], { name: 'accountingItemsIndex03' }, { transaction }),
        queryInterface.addIndex('accountingItems', ['creditLineId'], { name: 'accountingItemsIndex04' }, { transaction }),
        queryInterface.addIndex('accountingItems', ['debitLineId'], { name: 'accountingItemsIndex05' }, { transaction }),
        queryInterface.addIndex('customers', ['vatNumber'], { name: 'customersIndex01' }, { transaction }),
        queryInterface.addIndex('customerReferences', ['sourceDb', 'sourceId'], { name: 'customerReferencesIndex01' }, { transaction }),
        queryInterface.addIndex('customerReferences', ['customerId'], { name: 'customerReferencesIndex02' }, { transaction }),
        queryInterface.addIndex('saleAccountings', ['saleId'], { name: 'saleAccountingsIndex01' }, { transaction }),
        queryInterface.addIndex('saleAccountings', ['accountingItemId'], { name: 'saleAccountingsIndex02' }, { transaction }),
        queryInterface.addIndex('saleItems', ['saleId'], { name: 'saleItemsIndex01' }, { transaction }),
        queryInterface.addIndex('salePayments', ['saleId'], { name: 'salePaymentsIndex01' }, { transaction }),
        queryInterface.addIndex('slipTransactions', ['saleId'], { name: 'slipTransactionsIndex01' }, { transaction }),
        queryInterface.addIndex('slipOccurrences', ['transactionId'], { name: 'slipOccurrencesIndex01' }, { transaction }),
        queryInterface.addIndex('acquirerTransactions', ['saleId'], { name: 'acquirerTransactionsIndex01' }, { transaction }),
        queryInterface.addIndex('acquirerInstallments', ['transactionId'], { name: 'acquirerInstallmentsIndex01' }, { transaction }),
      ])
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeIndex('accountingItems', 'accountingItemsIndex01', { transaction }),
        queryInterface.removeIndex('accountingItems', 'accountingItemsIndex02', { transaction }),
        queryInterface.removeIndex('accountingItems', 'accountingItemsIndex03', { transaction }),
        queryInterface.removeIndex('accountingItems', 'accountingItemsIndex04', { transaction }),
        queryInterface.removeIndex('accountingItems', 'accountingItemsIndex05', { transaction }),
        queryInterface.removeIndex('customers', 'customersIndex01', { transaction }),
        queryInterface.removeIndex('customerReferences', 'customerReferencesIndex01', { transaction }),
        queryInterface.removeIndex('customerReferences', 'customerReferencesIndex02', { transaction }),
        queryInterface.removeIndex('saleAccountings', 'saleAccountingsIndex01', { transaction }),
        queryInterface.removeIndex('saleAccountings', 'saleAccountingsIndex02', { transaction }),
        queryInterface.removeIndex('saleItems', 'saleItemsIndex01', { transaction }),
        queryInterface.removeIndex('salePayments', 'salePaymentsIndex01', { transaction }),
        queryInterface.removeIndex('slipTransactions', 'slipTransactionsIndex01', { transaction }),
        queryInterface.removeIndex('slipOccurrences', 'slipOccurrencesIndex01', { transaction }),
        queryInterface.removeIndex('acquirerTransactions', 'acquirerTransactionsIndex01', { transaction }),
        queryInterface.removeIndex('acquirerInstallments', 'acquirerInstallmentsIndex01', { transaction }),
      ]);
    });
  },
};
