'use strict';
var passportLocalSequelize = require('passport-local-sequelize');

module.exports = function (sequelize, DataTypes) {
    var User = passportLocalSequelize.defineUser(
        sequelize,
        {
            firstName: {
                type: DataTypes.STRING,
                allowNull: true
            },
            surName: {
                type: DataTypes.STRING,
                allowNull: true
            },
            address: {
                type: DataTypes.STRING,
                allowNull: true
            },
            postalCode: {
                type: DataTypes.STRING,
                allowNull: true
            },
            city: {
                type: DataTypes.STRING,
                allowNull: true
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: true
            },
            country: {
                type: DataTypes.STRING,
                allowNull: true
            },
        },
        {
            classMethods: {
                associate: (models) => {
                    User.hasMany(models.Calendar, {
                        foreignKey: 'user_id',
                        as: 'Calendars',
                    });
                }
            },
        });
    return User;
};