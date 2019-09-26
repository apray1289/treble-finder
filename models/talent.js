module.exports = function (sequelize, DataTypes) {
  var Talent = sequelize.define("Talent", {
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
    area: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    talentList: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    genreList: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    soundcloudLink: {
      type: DataTypes.STRING,
    },
    bio: {
      type: DataTypes.TEXT,
    }


  });

  return Talent;
};
