module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message',
    {
      sender: {
        type:DataTypes.STRING,
        allowNull: false,
        validate: {notEmpty: true},
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {isEmail: true},
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {notEmpty: true},
      }
    },
    {
      classMethods: {
        associate: (models) => {
          Message.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
          })
        },
      }
    });
  return Message;
};