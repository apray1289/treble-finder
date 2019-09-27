module.exports = function (sequelize, DataTypes) {
    var Skill = sequelize.define("Skill", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        experience: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    Skill.associate = function (models) {
        Skill.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Skill;
};