'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      username: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
      },
      hash: {
          type: Sequelize.TEXT,
          allowNull: false
      },
      salt: {
          type: Sequelize.STRING,
          allowNull: false
      },
      activationKey: {
          type: Sequelize.STRING,
          allowNull: true
      },
      resetPasswordKey: {
          type: Sequelize.STRING,
          allowNull: true
      },
      verified: {
          type: Sequelize.BOOLEAN,
          allowNull: true
      },
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Users');
  }
};