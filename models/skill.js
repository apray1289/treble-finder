module.exports = function (sequelize, DataTypes) {
    var Skill = sequelize.define("Skill", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        experience: {
            type: DataTypes.INTEGER
        }
    });

    return Skill;
};