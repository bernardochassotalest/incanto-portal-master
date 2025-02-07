'use strict';

const tableName = 'users'

const structure = (Sequelize) => {
  return {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    active: Sequelize.BOOLEAN,
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    avatar: {
      type: Sequelize.STRING(42)
    },
    confirmationToken: {
      type: Sequelize.STRING(40)
    },
    password: {
      type: Sequelize.STRING(70),
      allowNull: false
    },
    accountId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'accounts',
        key: 'id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    },
    profileId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'profiles',
        key: 'id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    },
    lastAccess: Sequelize.JSON,
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false
    }
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
