"use strict";

const tableName = "businessPartners";

const structure = (Sequelize) => {
  return {
    cardCode: {
      type: Sequelize.STRING(50),
      primaryKey: true,
      allowNull: false,
    },
    cardName: { type: Sequelize.STRING(100), allowNull: false },
    tradeName: { type: Sequelize.STRING(100) },
    type: { type: Sequelize.STRING(20) },
    vatNumber: { type: Sequelize.STRING(20) },
    grpCode: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "bpGroups",
        key: "grpCode",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    account: { type: Sequelize.STRING(20) },
    lastDate: { type: Sequelize.STRING(10) },
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
