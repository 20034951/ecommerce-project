export default (sequelize, DataTypes) => {
    const UserRole = sequelize.define('UserRole', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'roles',
                key: 'id'
            },
            onDelete: 'CASCADE'
        }
    }, {
        tableName: 'user_roles',
        timestamps: false
    });

    return UserRole;
};