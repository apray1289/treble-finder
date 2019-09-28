module.exports = function (sequelize, DataTypes) {
    var Genre = sequelize.define("Genre", {
        name: {
            type: DataTypes.STRING
        }
    });
    return Genre;
};