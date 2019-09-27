module.exports = function (sequelize, DataTypes) {
    var Area = sequelize.define("Area", {
        name: {
            type: DataTypes.TEXT
        }
    });
    Area.associate = function (models) {
        Area.hasMany(models.User)
    };
    return Area;
}; 
