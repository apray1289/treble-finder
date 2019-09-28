module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("User", {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    lastName: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4]
      }
    },
    bio: {
      type: DataTypes.TEXT
    },
    image: {
      type: DataTypes.STRING
    }
  });
  User.associate = function (models) {
    User.hasMany(models.Skill);
  };
  User.associate = function (models) {
    User.belongsTo(models.Area, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return User;
};
