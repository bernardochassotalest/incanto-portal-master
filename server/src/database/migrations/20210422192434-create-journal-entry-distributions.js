'use strict';

const tableName = 'journalEntryDistributions'

const structure = (Sequelize) => {
  return {
    transId: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false, references: { model: 'journalEntries', key: 'transId', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    lineId: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    costingCenter: { type: Sequelize.STRING(10), primaryKey: true, allowNull: false, references: { model: 'costingCenters', key: 'ocrCode', onUpdate: 'CASCADE', onDelete: 'CASCADE' } },
    profitCode: { type: Sequelize.STRING(10) },
    validFrom: { type: Sequelize.STRING(10) },
    validTo: { type: Sequelize.STRING(10) },
    factor: { type: Sequelize.DECIMAL(12, 10) },
    debit: { type: Sequelize.DECIMAL(13, 2) },
    credit: { type: Sequelize.DECIMAL(13, 2) },
    balance: { type: Sequelize.DECIMAL(13, 2) },
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
        fields: ["transId", "lineId", "costingCenter"]
      }
    ]
  }
}

const constraint = 'Alter table "journalEntryDistributions" add  foreign key ("transId","lineId") references "journalEntryItems" ("transId","lineId") on update restrict on delete restrict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, structure(Sequelize), indexes())
              .then(() => queryInterface.sequelize.query(constraint));
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable(tableName);
  },
};
