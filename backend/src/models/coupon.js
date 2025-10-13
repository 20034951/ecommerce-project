export default (sequelize, DataTypes) => {
    const Coupon = sequelize.define('Coupon', {
        coupon_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        code: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        discount: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('percent', 'fixed'),
            defaultValue: 'percent'
        },
        valid_from: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        valid_until: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        usage_limit: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'coupon',
        timestamps: false
    });

    Coupon.associate = (models) => {
        Coupon.hasMany(models.Order, {
            foreignKey: 'coupon_id',
            as: 'orders'
        });
    };

    return Coupon;
};