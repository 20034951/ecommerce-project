export default (sequelize, DataTypes) => {
    const UserAddress = sequelize.define('UserAddress', {
        address_id: {
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
        address_line: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        city: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        state: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        country: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        postal_code: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        type: {
            type: DataTypes.ENUM('shipping', 'billing'),
            defaultValue: 'shipping'
        }
    }, {
        tableName: 'user_address',
        timestamps: false
    });

    UserAddress.associate = (models) => {
        UserAddress.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
        UserAddress.hasMany(models.Order, {
            foreignKey: 'address_id',
            as: 'orders'
        });
    };

    return UserAddress;
};