export default (sequelize, DataTypes) => {
    const CartItem = sequelize.define('CartItem', {
        cart_item_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        cart_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'cart',
                key: 'cart_id'
            }
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'product',
                key: 'product_id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        }
    }, {
        tableName: 'cart_item',
        timestamps: false
    });

    CartItem.associate = (models) => {
        CartItem.belongsTo(models.Cart, {
            foreignKey: 'cart_id',
            as: 'cart'
        });
        CartItem.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product'
        });
    };

    return CartItem;
};