export default (sequelize, DataTypes) => {
    const OrderStatusHistory = sequelize.define('OrderStatusHistory', {
        history_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'orders',
                key: 'order_id'
            }
        },
        status: {
            type: DataTypes.ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'),
            allowNull: false
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        changed_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'user',
                key: 'user_id'
            }
        }
    }, {
        tableName: 'order_status_history',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    OrderStatusHistory.associate = (models) => {
        OrderStatusHistory.belongsTo(models.Order, {
            foreignKey: 'order_id',
            as: 'order'
        });
        OrderStatusHistory.belongsTo(models.User, {
            foreignKey: 'changed_by',
            as: 'user'
        });
    };

    return OrderStatusHistory;
};
