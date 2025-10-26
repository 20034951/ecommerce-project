export default (sequelize, DataTypes) => {
    const PaymentMethod = sequelize.define(
        'PaymentMethod',
        {
            payment_method_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
            code: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
                comment: 'Código único para identificar el método de pago (bank_transfer, credit_card, cash_on_delivery)',
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            icon: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: 'Nombre del ícono para mostrar en el frontend',
            },
            display_order: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: 'Orden en que se muestra en el frontend',
            },
        },
        {
            tableName: 'payment_methods',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    PaymentMethod.associate = (models) => {
        PaymentMethod.hasMany(models.Order, {
            foreignKey: 'payment_method_id',
            as: 'orders',
        });
    };

    return PaymentMethod;
};
