module.exports = (sequelize, DataTypes) => {
  const Calendar = sequelize.define('Calendar',
    {
      title: DataTypes.STRING,
      allowNull: false,
    },
    {
      classMethods: {
        associate: (models) => {
          Calendar.belongsTo(models.Product, {
              foreignKey: 'product_id',
              onDelete: 'CASCADE',
            })
          Calendar.hasMany(models.Activity, {
            foreignKey: 'calendar_id',
            as: 'Activities',
          });
        },
      },
    })
  return Calendar
}