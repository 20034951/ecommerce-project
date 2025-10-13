export default (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        order_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'user_id'
            }
        },
        address_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user_address',
                key: 'address_id'
            }
        },
        status: {
            type: DataTypes.ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled'),
            defaultValue: 'pending'
        },
        total_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        shipping_method_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'shipping_method',
                key: 'shipping_method_id'
            }
        },
        coupon_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'coupon',
                key: 'coupon_id'
            }
        }
    }, {
        tableName: 'orders',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    Order.associate = (models) => {
        Order.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
        Order.belongsTo(models.UserAddress, {
            foreignKey: 'address_id',
            as: 'address'
        });
        Order.belongsTo(models.ShippingMethod, {
            foreignKey: 'shipping_method_id',
            as: 'shippingMethod'
        });
        Order.belongsTo(models.Coupon, {
            foreignKey: 'coupon_id',
            as: 'coupon'
        });
        Order.hasMany(models.OrderItem, {
            foreignKey: 'order_id',
            as: 'items'
        });
    };

    return Order;
};