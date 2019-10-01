module.exports = function (sequelize, DataTypes) {
    var Area = sequelize.define("Area", {
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
    Area.associate = function (models) {
        Area.belongsToMany(models.User, { through: 'UserArea'});
    };
    return Area;
}; 
