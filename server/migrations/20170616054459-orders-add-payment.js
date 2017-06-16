module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.sequelize.transaction((t) => {
      let migrations = [];
      migrations.push(queryInterface.addColumn(
        'Orders',
        'amount',
        {
          type: Sequelize.FLOAT(10, 2),
          allowNull: false,
        },
        {transaction: t}
      ))

      migrations.push(
        queryInterface.addColumn(
          'Orders',
          'success',
          {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          {transaction: t}
        )
      )

      migrations.push(
        queryInterface.addColumn(
          'Orders',
          'paymentAt',
          {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null,
          },
          {transaction: t}
        )
      );

      migrations.push(
        queryInterface.addColumn(
          'Orders',
          'token',
          {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
          },
          {transaction: t}
        )
      );
      return Promise.all(migrations);

    });

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.sequelize.transaction((t) => {
      let migrations = [];

      migrations.push(queryInterface.removeColumn('Orders', 'amount', {transaction: t}));
      migrations.push(queryInterface.removeColumn('Orders', 'success', {transaction: t}));
      migrations.push(queryInterface.removeColumn('Orders', 'paymentAt', {transaction: t}));
      migrations.push(queryInterface.removeColumn('Orders', 'token', {transaction: t}));

      return Promise.all(migrations);
    });

  }
};
