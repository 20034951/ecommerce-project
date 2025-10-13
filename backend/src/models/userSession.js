export default (sequelize, DataTypes) => {
    const UserSession = sequelize.define('UserSession', {
        session_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'user_id'
            }
        },
        token_id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        device_info: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        ip_address: {
            type: DataTypes.STRING(45),
            allowNull: true
        },
        user_agent: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        last_activity: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'user_sessions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    UserSession.associate = (models) => {
        UserSession.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return UserSession;
};