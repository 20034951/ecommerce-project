export default (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
        notification_id: {
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
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('unread', 'read'),
            defaultValue: 'unread'
        }
    }, {
        tableName: 'notification',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    Notification.associate = (models) => {
        Notification.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return Notification;
};