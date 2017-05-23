module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product',
    {
      serial: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      classMethods: {
        associate: (models) => {
          Product.hasMany(models.Calendar, {
            foreignKey: 'product_id',
            as: 'Calendars',
          });
          Product.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
          })
        },
      }
    });
  return Product;
};
