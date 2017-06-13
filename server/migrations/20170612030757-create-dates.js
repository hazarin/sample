module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Dates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dt: {
        type: Sequelize.DATEONLY,
      },
    }).then(() => {
      return queryInterface.addIndex('Dates', ['dt']);
    });
  },
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Dates'),
};