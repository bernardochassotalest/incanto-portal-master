"use strict";

const tableName = "chartOfAccounts";

const structure = (Sequelize) => {
  return {
    acctCode: {
      type: Sequelize.STRING(20),
      primaryKey: true,
      allowNull: false,
    },
    acctName: { type: Sequelize.STRING(100), allowNull: false },
    accountType: { type: Sequelize.STRING(30) },
    titleAccount: { type: Sequelize.BOOLEAN },
    lockManual: { type: Sequelize.BOOLEAN },
    level: { type: Sequelize.INTEGER },
    group: { type: Sequelize.INTEGER },
    grpLine: { type: Sequelize.INTEGER },
    lastDate: { type: Sequelize.STRING(20) },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
  };
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, structure(Sequelize));
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName);
  },
};
