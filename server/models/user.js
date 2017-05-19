const passportLocalSequelize = require('passport-local-sequelize')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User',
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {isEmail: true},
      },
      hash: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      activationKey: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordKey: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {notEmpty: true},
      },
      surName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {notEmpty: true},
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {notEmpty: true},
      },
      postalCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {notEmpty: true},
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {notEmpty: true},
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {notEmpty: true},
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {notEmpty: true},
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
  passportLocalSequelize.attachToUser(User, {
    usernameField: 'email',
    activationRequired: true,
    activationkeylen:  8,
    resetPasswordkeylen:  8,
  });
  return User
};
