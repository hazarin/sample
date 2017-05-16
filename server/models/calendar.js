'use strict';
module.exports = function(sequelize, DataTypes) {
    const Calendar = sequelize.define('calendar',
        {
            name: DataTypes.STRING
        },
        {
            classMethods: {
                associate: (models) => {
                    Calendar.hasMany(models.Activity, {
                        foreignKey: 'calendar_id',
                        as: 'Activities',
                    });
                    // Calendar.belongsTo(models.User, {
                    //     foreignKey: 'user_id',
                    //     onDelete: 'CASCADE',
                    // });
                },
            },
        });
    return Calendar;
};