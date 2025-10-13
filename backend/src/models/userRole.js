export default (sequelize, DataTypes) => {
    const UserRole = sequelize.define('UserRole', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id'
            },
            onDelete: 'CASCADE'
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'roles',
                key: 'role_id'
            },
            onDelete: 'CASCADE'
        }
    }, {
        tableName: 'user_roles',
        timestamps: false
    });

    UserRole.associate = (models) => {
        UserRole.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
        UserRole.belongsTo(models.Role, {
            foreignKey: 'role_id',
            as: 'Role'
        });
    };

    return UserRole;
};