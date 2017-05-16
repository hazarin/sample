'use strict';
module.exports = function (sequelize, DataTypes) {
    const Activity = sequelize.define('Activity',
        {
            repeat: {
                type: DataTypes.ENUM,
                values: ['not', 'day', 'week', 'month'],
                allowNull: false,
                defaultValue: 'not'
            }
        },
        {
            classMethods: {
                associate: function (models) {
                    Activity.belongsTo(models.Calendar, {
                        foreignKey: 'calendar_id',
                        onDelete: 'CASCADE',
                    });
                }
            }
        });
    return Activity;
};