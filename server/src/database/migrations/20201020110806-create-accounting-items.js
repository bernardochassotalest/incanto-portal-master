"use strict";

const tableName = "accountingItems";

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(100), primaryKey: true, allowNull: false },
    sourceDb: { type: Sequelize.STRING(50) },
    sourceId: { type: Sequelize.STRING(100) },
    refDate: { type: Sequelize.STRING(10) },
    taxDate: { type: Sequelize.STRING(10) },
    dueDate: { type: Sequelize.STRING(10) },
    tag: { type: Sequelize.STRING(30) },
    accountItem: {
      type: Sequelize.STRING(50),
      allowNull: false,
      references: {
        model: "accountConfigs",
        key: "id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    amount: { type: Sequelize.DECIMAL(13, 2) },
    pointOfSale: { type: Sequelize.STRING(20) },
    championshipId: { type: Sequelize.STRING(50) },
    matchId: { type: Sequelize.STRING(50) },
    jeId: { type: Sequelize.STRING(50) },
    debitLineId: { type: Sequelize.STRING(50) },
    creditLineId: { type: Sequelize.STRING(50) },
    extraMemo: { type: Sequelize.STRING(100) },
    timeLog: { type: Sequelize.STRING(50) },
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
