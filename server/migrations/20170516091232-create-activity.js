'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('activities', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            repeat: {
                type: Sequelize.ENUM,
                values: ['not', 'day', 'week', 'month'],
                allowNull: false,
                defaultValue: 'not'
            },
            activity_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            activity_day: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            activity_time: {
                type: Sequelize.DATE,
                allowNull: false
            },
            activity_type: {
                type: Sequelize.ENUM,
                values: ['medicine', 'visitor', 'doctor', 'food', 'bathe', 'sleep', 'other'],
                allowNull: false
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaulValue: true
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            calendar_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'calendars',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
        });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('Activities');
    }
};