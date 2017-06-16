module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      amount: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: false,
      },
      success: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      paymentAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
    classMethods: {
      associate: (models) => {
        Order.belongsTo(models.User, {
          foreignKey: 'user_id',
          onDelete: 'CASCADE',
        }),
        Order.belongsTo(models.Product, {
          foreignKey: 'product_id',
          onDelete: 'CASCADE',
        }),
        Order.belongsTo(models.Catalog, {
          foreignKey: 'catalog_id',
          onDelete: 'CASCADE',
        })
      }
    }
  });
  return Order;
};
