module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: true,
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
