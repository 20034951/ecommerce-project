export default (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        id: {
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
        timestamps: true
    });

    Role.associate = (models) => {
        Role.belongsToMany(models.User, 
            { 
                through: models.UserRole, 
                foreignKey: 'roleId',
                otherKey: 'userId' 
            });
    }

    return Role;
};