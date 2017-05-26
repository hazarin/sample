module.exports = (sequelize, DataTypes) => {
  const Catalog = sequelize.define('Catalog', {
    title: {
      type: DataTypes.STRING,
    },
    short_description: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    icon: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
    },
    type: {
      type: DataTypes.ENUM,
      values: ['product', 'membership'],
      allowNull: false,
      defaultValue: 'membership',
    },
    membership: {
      type: DataTypes.ENUM,
      values: ['time', 'calendar', 'pro'],
      allowNull: false,
      defaultValue: 'time',
    },
  },
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Catalog;
};