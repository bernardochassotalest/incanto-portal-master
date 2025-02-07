"use strict";

const tableName = "accountConfigs";

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    model: {
      type: Sequelize.STRING(30),
      allowNull: false,
      references: {
        model: "accountingModels",
        key: "id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    source: {
      type: Sequelize.STRING(30),
      allowNull: false
    },
    item: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    validFrom: { type: Sequelize.STRING(10) },
    debAccount: {
      type: Sequelize.STRING(20),
      allowNull: false,
      references: {
        model: "chartOfAccounts",
        key: "acctCode",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    debShortName: {
      type: Sequelize.STRING(20),
      references: {
        model: "businessPartners",
        key: "cardCode",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    debCostingCenter: {
      type: Sequelize.STRING(10),
      references: {
        model: "costingCenters",
        key: "ocrCode",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    debProject: {
      type: Sequelize.STRING(20),
      references: {
        model: "projects",
        key: "prjCode",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    crdAccount: {
      type: Sequelize.STRING(20),
      allowNull: false,
      references: {
        model: "chartOfAccounts",
        key: "acctCode",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    crdShortName: {
      type: Sequelize.STRING(20),
      references: {
        model: "businessPartners",
        key: "cardCode",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    crdCostingCenter: {
      type: Sequelize.STRING(10),
      references: {
        model: "costingCenters",
        key: "ocrCode",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    crdProject: {
      type: Sequelize.STRING(20),
      references: {
        model: "projects",
        key: "prjCode",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    isActive: { type: Sequelize.BOOLEAN },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
  };
};

const constraint = 'Alter table "accountConfigs" add  foreign key ("source","item") references "sourceItems" ("source","id") on update restrict on delete restrict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, structure(Sequelize))
              .then(() => queryInterface.sequelize.query(constraint));
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName);
  },
};