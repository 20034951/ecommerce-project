export default (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        role: {
            type: DataTypes.ENUM('customer', 'admin', 'editor'),
            defaultValue: 'customer'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'user',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    User.associate = (models) => {
        User.hasMany(models.UserAddress, { 
            foreignKey: 'user_id',
            as: 'addresses'
        });
        User.hasMany(models.Cart, {
            foreignKey: 'user_id',
            as: 'carts'
        });
        User.hasMany(models.Order, {
            foreignKey: 'user_id',
            as: 'orders'
        });
        User.hasMany(models.Review, {
            foreignKey: 'user_id',
            as: 'reviews'
        });
        User.hasMany(models.Notification, {
            foreignKey: 'user_id',
            as: 'notifications'
        });
        User.hasMany(models.UserSession, {
            foreignKey: 'user_id',
            as: 'sessions'
        });
    }

    return User;
};