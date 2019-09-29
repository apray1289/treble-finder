module.exports = function(sequelize, DataTypes) {
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
      },
      unique: {
        args: true,
        msg: "Email address already in use!"
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4]
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    bio: {
      type: DataTypes.TEXT
    },
    image: {
      type: DataTypes.STRING
    },
    soundLink: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  },{
    validate: {
      hasAllProperties () {
        if (this.firstName === null) {
          throw new Error('Require First Name')
        }
        if (this.email === null) {
          throw new Error('Require Email')
        }
        if (this.password === null) {
          throw new Error('Require Password')
        }
        if (this.phone === null) {
          throw new Error('Require Phone')
        }
      }
    }
  }, {
    indexes: [
      // Create a unique index on email
      {
        unique: true,
        fields: ['email']
      }
    ]
  });

  User.associate = function(models) {
    User.belongsToMany(models.Genre, { through: "UserGenre" });
    User.belongsToMany(models.Skill, { through: "UserSkill" });
    User.belongsToMany(models.Area, { through: "UserArea" });
  };

  return User;
};
