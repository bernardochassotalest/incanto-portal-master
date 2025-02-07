'use strict';

const tableName = 'journalEntryItemDetails'

const structure = (Sequelize) => {
  return {
    transId: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false, references: { model: 'journalEntries', key: 'transId', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    lineId: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    docEntry: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    lineNum: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    itemCode: { type: Sequelize.STRING(50) },
    description: { type: Sequelize.STRING(100) },
    memo: { type: Sequelize.STRING(500) },
    lineTotal: { type: Sequelize.DECIMAL(13, 2) },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false }
  }
}

const indexes = () => {
  return {
    indexes: [
      {
        type: "primary",
        unique: true,
        fields: ["transId", "lineId", "docEntry", "lineNum"]
      }
    ]
  }
}

const constraint = 'Alter table "journalEntryItemDetails" add  foreign key ("transId","lineId") references "journalEntryItems" ("transId","lineId") on update restrict on delete restrict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, structure(Sequelize), indexes())
              .then(() => queryInterface.sequelize.query(constraint));
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName);
  },
};
