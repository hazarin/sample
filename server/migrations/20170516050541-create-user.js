'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('Users', {
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
            username: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            hash: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            salt: {
                type: Sequelize.STRING,
                allowNull: false
            },
            activationKey: {
                type: Sequelize.STRING,
                allowNull: true
            },
            resetPasswordKey: {
                type: Sequelize.STRING,
                allowNull: true
            },
            verified: {
                type: Sequelize.BOOLEAN,
                allowNull: true
            },
            firstName: {
                type: Sequelize.STRING,
                allowNull: true
            },
            surName: {
                type: Sequelize.STRING,
                allowNull: true
            },
            address: {
                type: Sequelize.STRING,
                allowNull: true
            },
            postalCode: {
                type: Sequelize.STRING,
                allowNull: true
            },
            city: {
                type: Sequelize.STRING,
                allowNull: true
            },
            phone: {
                type: Sequelize.STRING,
                alllowNull: true
            },
            country: {
                type: Sequelize.STRING,
                alllowNull: true
            },
        });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('users');
    }
};