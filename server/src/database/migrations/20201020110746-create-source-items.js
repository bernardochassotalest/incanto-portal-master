"use strict";

const tableName = "sourceItems";

const structure = (Sequelize) => {
  return {
    source: {
      type: Sequelize.STRING(30),
      primaryKey: true,
      allowNull: false,
      references: {
        model: "dataSources",
        key: "id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    name: { type: Sequelize.STRING(100) },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
  };
};

const indexes = () => {
  return {
    indexes: [
      {
        type: "primary",
        unique: true,
        fields: ["source", "id"]
      }
    ]
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, structure(Sequelize), indexes());
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName);
  },
};