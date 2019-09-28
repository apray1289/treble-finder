module.exports = function (sequelize, DataTypes) {
    var Area = sequelize.define("Area", {
        name: {
            type: DataTypes.TEXT
        }
    });
    Area.associate = function (models) {
        Area.hasMany(models.User);
    };
    Area.associate = function (models) {
        Area.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };
    return Area;
}; 
