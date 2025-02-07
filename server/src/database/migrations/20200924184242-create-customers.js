'use strict';

const tableName = 'customers'

const structure = (Sequelize) => {
  return {
    id: { type: Sequelize.STRING(50), primaryKey: true, allowNull: false },
    name: { type: Sequelize.STRING(200), allowNull: false },
    vatNumber: { type: Sequelize.STRING(20), allowNull: false },
    email: { type: Sequelize.STRING(200) },
    phone: { type: Sequelize.STRING(20) },
    birthDate: { type: Sequelize.STRING(10) },
    street: { type: Sequelize.STRING(200) },
    streetNo: { type: Sequelize.STRING(100) },
    complement: { type: Sequelize.STRING(100) },
    neighborhood: { type: Sequelize.STRING(100) },
    zipCode: { type: Sequelize.STRING(10) },
    city: { type: Sequelize.STRING(100) },
    state: { type: Sequelize.STRING(2) },
    country: { type: Sequelize.STRING(50) },
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
