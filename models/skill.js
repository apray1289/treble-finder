module.exports = function (sequelize, DataTypes) {
    var Skill = sequelize.define("Skill", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        experience: {
            type: DataTypes.INTEGER
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        }
    });

    return Skill;
};