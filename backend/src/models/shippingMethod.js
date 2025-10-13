export default (sequelize, DataTypes) => {
    const ShippingMethod = sequelize.define('ShippingMethod', {
        shipping_method_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        cost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        region: {
            type: DataTypes.STRING(100),
            allowNull: true
        }
    }, {
        tableName: 'shipping_method',
        timestamps: false
    });

    ShippingMethod.associate = (models) => {
        ShippingMethod.hasMany(models.Order, {
            foreignKey: 'shipping_method_id',
            as: 'orders'
        });
    };

    return ShippingMethod;
};