export default (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        role_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'roles',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    Role.associate = (models) => {
        Role.hasMany(models.UserRole, {
            foreignKey: 'role_id',
            as: 'UserRoles'
        });
    };

    return Role;
};