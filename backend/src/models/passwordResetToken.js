const PasswordResetTokenModel = (sequelize, DataTypes) => {
    const PasswordResetToken = sequelize.define('PasswordResetToken', {
        token_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        used: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        used_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'password_reset_tokens',
        timestamps: false,
        indexes: [
            {
                fields: ['token']
            },
            {
                fields: ['user_id']
            },
            {
                fields: ['expires_at']
            }
        ]
    });

    // Asociaciones
    PasswordResetToken.associate = (models) => {
        PasswordResetToken.belongsTo(models.User, { 
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    // Métodos estáticos
    PasswordResetToken.isValidToken = async function(token) {
        const { Op } = sequelize.Sequelize;
        const resetToken = await this.findOne({
            where: {
                token,
                used: false,
                expires_at: {
                    [Op.gt]: new Date()
                }
            },
            include: [{
                model: sequelize.models.User,
                as: 'user'
            }]
        });

        return resetToken;
    };

    PasswordResetToken.markAsUsed = async function(token) {
        await this.update(
            { 
                used: true,
                used_at: new Date()
            },
            {
                where: { token }
            }
        );
    };

    PasswordResetToken.cleanExpiredTokens = async function() {
        const { Op } = sequelize.Sequelize;
        await this.destroy({
            where: {
                expires_at: {
                    [Op.lt]: new Date()
                }
            }
        });
    };

    return PasswordResetToken;
};

export default PasswordResetTokenModel;