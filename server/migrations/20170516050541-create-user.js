module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      hash: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      salt: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      activationKey: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      resetPasswordKey: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      surName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      postalCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      membership: {
        type: Sequelize.ENUM,
        values: ['time', 'calendar', 'pro'],
        allowNull: true,
        defaultValue: null,
      },
    })
  },
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Users'),
};
