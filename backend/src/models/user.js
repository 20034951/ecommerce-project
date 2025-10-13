import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: { 
            type: DataTypes.INTEGER, 
            autoIncrement: true, 
            primaryKey: true 
        },
        name: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
        username: { 
            type: DataTypes.STRING, 
            allowNull: false, 
            unique: true 
        },
        email: { 
            type: DataTypes.STRING, 
            allowNull: false, 
            unique: true 
        },
        password: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
        isActive: { 
            type: DataTypes.BOOLEAN, 
            defaultValue: true 
        }
    }, {
        tableName: 'users',
        timestamps: true,
        defaultScope: { attributes: { exclude: ['password'] } },
        scopes: { withPassword: { attributes: { include: ['password'] } } },
        hooks: {
            beforeCreate: async (user) => {
                if(user.password) {
                    console.log('[DEBUG][User.beforeCreate] hashing password for:', user.username);
                    user.password = await bcrypt.hash(user.password, 12);
                    console.log('[DEBUG][User.beforeCreate] hashed password length:', user.password.length);
                }
            },
            beforeUpdate: async (user) => {
                if(user.changed('password')) {
                    console.log('[DEBUG][User.beforeUpdate] hashing updated password for:', user.username);
                    user.password = await bcrypt.hash(user.password, 12);
                    console.log('[DEBUG][User.beforeUpdate] hashed password length:', user.password.length);
                }
            }
        }
    });

    User.associate = (models) => {
        User.belongsToMany(models.Role, { through: models.UserRole, foreignKey: 'userId', otherKey: 'roleId' });
    }

    return User;
};