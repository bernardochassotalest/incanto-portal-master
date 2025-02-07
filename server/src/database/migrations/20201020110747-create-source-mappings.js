"use strict";

const tableName = "sourceMappings";

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
    name: { type: Sequelize.STRING(200) },
    itemSource: { type: Sequelize.STRING(30) },
    itemId: { type: Sequelize.STRING(50) },
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

const constraint = 'Alter table "sourceMappings" add  foreign key ("itemSource","itemId") references "sourceItems" ("source","id") on update restrict on delete restrict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, structure(Sequelize), indexes())
              .then(() => queryInterface.sequelize.query(constraint));
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName);
  },
};