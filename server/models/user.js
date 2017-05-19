const passportLocalSequelize = require('passport-local-sequelize')

module.exports = (sequelize, DataTypes) => {
  const User = passportLocalSequelize.defineUser(
    sequelize,
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      surName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postalCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      membership: {
        type: DataTypes.ENUM,
        values: ['time', 'calendar', 'pro'],
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      classMethods: {
        associate: (models) => {
          User.hasMany(models.Product, {
            foreignKey: 'user_id',
            as: 'Products',
          })
        },
      },
    });
  return User
};
