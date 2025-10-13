export default (sequelize, DataTypes) => {
    const ProductTag = sequelize.define('ProductTag', {
        tag_id: {
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
        tag: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    }, {
        tableName: 'product_tag',
        timestamps: false
    });

    ProductTag.associate = (models) => {
        ProductTag.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product'
        });
    };

    return ProductTag;
};