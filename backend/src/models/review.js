export default (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
        review_id: {
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
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'user_id'
            }
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'review',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    Review.associate = (models) => {
        Review.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product'
        });
        Review.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return Review;
};