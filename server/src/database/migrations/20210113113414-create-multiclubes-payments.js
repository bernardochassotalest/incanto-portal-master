'use strict';

const tableName = 'multiclubesPayments'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    paymentId: { type: Sequelize.STRING(20) },
    itemPaymentId: { type: Sequelize.STRING(20) },
    titleId: { type: Sequelize.STRING(20) },
    titleNumber: { type: Sequelize.STRING(20) },
    memberVatNumber: { type: Sequelize.STRING(20) },
    memberName: { type: Sequelize.STRING(200) },
    type: { type: Sequelize.STRING(50) },
    mode: { type: Sequelize.STRING(50) },
    paidDate: { type: Sequelize.STRING(10) },
    paidAmount: { type: Sequelize.DECIMAL(13, 2) },
    dunInstitution: { type: Sequelize.STRING(5) },
    dunBranch: { type: Sequelize.STRING(10) },
    dunAccount: { type: Sequelize.STRING(20) },
    dunDueDate: { type: Sequelize.STRING(10) },
    dunOurNumber: { type: Sequelize.STRING(20) },
    dunReturnFile: { type: Sequelize.STRING(100) },
    tefInstitution: { type: Sequelize.STRING(20) },
    tefCardType: { type: Sequelize.STRING(50) },
    tefDate: { type: Sequelize.STRING(10) },
    tefTime: { type: Sequelize.STRING(10) },
    tefNsu: { type: Sequelize.STRING(20) },
    tefAuthNumber: { type: Sequelize.STRING(20) },
    tefTid: { type: Sequelize.STRING(30) },
    tefCardNumber: { type: Sequelize.STRING(20) },
    tefParcelType: { type: Sequelize.STRING(50) },
    tefParcelQty: { type: Sequelize.STRING(10) },
    tefHolderName: { type: Sequelize.STRING(200) },
    checkInstitution: { type: Sequelize.STRING(5) },
    checkDueDate: { type: Sequelize.STRING(10) },
    checkNumber: { type: Sequelize.STRING(20) },
    checkOwner: { type: Sequelize.STRING(200) },
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
