export default (sequelize, DataTypes) => {
    const Cart = sequelize.define('Cart', {
        cart_id: {
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
        }
    }, {
        tableName: 'cart',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    Cart.associate = (models) => {
        Cart.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
        Cart.hasMany(models.CartItem, {
            foreignKey: 'cart_id',
            as: 'items'
        });
    };

    return Cart;
};