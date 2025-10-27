export default (sequelize, DataTypes) => {
    const StockMovement = sequelize.define('StockMovement', {
        movement_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'product',
                key: 'product_id'
            }
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'order',
                key: 'order_id'
            }
        },
        movement_type: {
            type: DataTypes.ENUM('sale', 'cancellation', 'adjustment', 'restock'),
            allowNull: false,
            comment: 'sale: Venta/pedido, cancellation: Cancelación de pedido, adjustment: Ajuste manual, restock: Reabastecimiento'
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Cantidad positiva para incrementos, negativa para decrementos'
        },
        previous_stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Stock antes del movimiento'
        },
        new_stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Stock después del movimiento'
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'user',
                key: 'user_id'
            },
            comment: 'Usuario que realizó el movimiento (si aplica)'
        }
    }, {
        tableName: 'stock_movement',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false // Solo necesitamos created_at
    });

    StockMovement.associate = (models) => {
        StockMovement.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product'
        });

        StockMovement.belongsTo(models.Order, {
            foreignKey: 'order_id',
            as: 'order'
        });

        StockMovement.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return StockMovement;
};
