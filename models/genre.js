module.exports = function (sequelize, DataTypes) {
    var Genre = sequelize.define("Genre", {
        name: {
            type: DataTypes.STRING
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        }
    });

    Genre.associate = function (models) {
        Genre.belongsToMany(models.User, { through: 'UserGenre'});
    };

    return Genre;
};