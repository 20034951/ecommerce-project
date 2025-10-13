export default (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        product_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'category',
                key: 'category_id'
            }
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        sku: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: true
        }
    }, {
        tableName: 'product',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    Product.associate = (models) => {
        Product.belongsTo(models.Category, {
            foreignKey: 'category_id',
            as: 'category'
        });
        Product.hasMany(models.ProductTag, {
            foreignKey: 'product_id',
            as: 'tags'
        });
        Product.hasMany(models.CartItem, {
            foreignKey: 'product_id',
            as: 'cartItems'
        });
        Product.hasMany(models.OrderItem, {
            foreignKey: 'product_id',
            as: 'orderItems'
        });
        Product.hasMany(models.Review, {
            foreignKey: 'product_id',
            as: 'reviews'
        });
    };

    return Product;
};