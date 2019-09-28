module.exports = function (sequelize, DataTypes) {
    var Genre = sequelize.define("Genre", {
        name: {
            type: DataTypes.STRING
        }
    });
    Genre.associate = function (models) {
        Genre.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };
    return Genre;
};