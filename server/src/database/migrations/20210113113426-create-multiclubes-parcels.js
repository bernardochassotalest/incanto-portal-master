'use strict';

const tableName = 'multiclubesParcels'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    saleId: { type: Sequelize.STRING(20) },
    saleDate: { type: Sequelize.STRING(10) },
    paymentId: { type: Sequelize.STRING(20) },
    productId: { type: Sequelize.STRING(20) },
    productName: { type: Sequelize.STRING(200) },
    productGroup: { type: Sequelize.STRING(10) },
    accountingGroup: { type: Sequelize.STRING(20) },
    dependentName: { type: Sequelize.STRING(200) },
    dependentParentage: { type: Sequelize.STRING(50) },
    parcelId: { type: Sequelize.STRING(20) },
    dueDate: { type: Sequelize.STRING(10) },
    parcelAmount: { type: Sequelize.DECIMAL(13, 2) },
    interestAmount: { type: Sequelize.DECIMAL(13, 2) },
    arrearsAmount: { type: Sequelize.DECIMAL(13, 2) },
    discountAmount: { type: Sequelize.DECIMAL(13, 2) },
    downPayment: { type: Sequelize.DECIMAL(13, 2) },
    amountDue: { type: Sequelize.DECIMAL(13, 2) },
    paidAmount: { type: Sequelize.DECIMAL(13, 2) },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false }
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, structure(Sequelize));
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.dropTable(tableName);
  }
};
