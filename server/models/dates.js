module.exports = (sequelize, DataTypes) => {
  const Dates = sequelize.define('Dates',
    {
        dt: DataTypes.DATEONLY
    },
      {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Dates;
};