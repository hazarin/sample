module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Catalogs', {
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
      title: {
        type: Sequelize.STRING
      },
      short_description: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      icon: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DECIMAL(10,2),
      },
      type: {
        type: Sequelize.ENUM,
        values: ['product', 'membership'],
        allowNull: false,
        defaultValue: 'membership',
      },
      membership: {
        type: Sequelize.ENUM,
        values: ['time', 'calendar', 'pro'],
        allowNull: false,
        defaultValue: 'time',
      },
    });
  },
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Catalogs'),
};