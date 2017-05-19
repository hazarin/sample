module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define('Activity',
    {
      repeat: {
        type: DataTypes.ENUM,
        values: ['not', 'day', 'week', 'month'],
        allowNull: false,
        defaultValue: 'not',
      },
      activity_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      activity_day: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      activity_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      activity_type: {
        type: DataTypes.ENUM,
        values: [
          'medicine',
          'visitor',
          'doctor',
          'food',
          'bathe',
          'sleep',
          'other'],
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaulValue: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      classMethods: {
        associate: (models) => {
          Activity.belongsTo(models.Calendar, {
            foreignKey: 'calendar_id',
            onDelete: 'CASCADE',
          })
        },
      },
    })
  return Activity
};
