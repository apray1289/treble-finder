module.exports = function (sequelize, DataTypes) {
    var Area = sequelize.define("Area", {
        name: {
            type: DataTypes.TEXT
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        }
    });
    Area.associate = function (models) {
        Area.hasMany(models.User);
    };
    return Area;
}; 
