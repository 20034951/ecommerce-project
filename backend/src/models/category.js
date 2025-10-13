export default (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        category_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'category',
                key: 'category_id'
            }
        }
    }, {
        tableName: 'category',
        timestamps: false
    });

    Category.associate = (models) => {
        Category.hasMany(models.Product, {
            foreignKey: 'category_id',
            as: 'products'
        });
        Category.belongsTo(Category, {
            foreignKey: 'parent_id',
            as: 'parent'
        });
        Category.hasMany(Category, {
            foreignKey: 'parent_id',
            as: 'children'
        });
    };

    return Category;
};