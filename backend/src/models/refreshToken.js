import bcrypt from 'bcrypt';
import crypto from 'crypto';

export default (sequelize, DataTypes) => {
    const RefreshToken = sequelize.define('RefreshToken', {
        id: { 
            type: DataTypes.INTEGER, 
            autoIncrement: true, 
            primaryKey: true 
        },
        tokenId: { 
            type: DataTypes.STRING(64), 
            allowNull: false, 
            unique: true 
        },
        tokenHash: { 
            type: DataTypes.STRING(255), 
            allowNull: false 
        },
        userId: { 
            type: DataTypes.INTEGER, 
            allowNull: false, 
            references: { 
                model: 'users', 
                key: 'id' 
            }, 
            onDelete: 'CASCADE' 
        },
        expiresAt: { 
            type: DataTypes.DATE, 
            allowNull: false 
        }
    }, {
        tableName: 'refresh_tokens',
        timestamps: true,
        indexes: [{ fields: ['tokenId'] }, { fields: ['userId'] }]
    });

    RefreshToken.associate = (models) => {
        RefreshToken.belongsTo(models.User, { foreignKey: 'userId' });
    };

    RefreshToken.tokenIdFromToken = (token) => {
        if (!token) throw new Error('Token required');
        return crypto.createHash('sha256').update(token).digest('hex');
    };

    RefreshToken.hashToken = async (token) => {
        if (!token) throw new Error('Token required');
        console.log('[DEBUG][RefreshToken.hashToken] hashing token length:', token.length);
        const hash = await bcrypt.hash(token, 12);
        console.log('[DEBUG][RefreshToken.hashToken] produced hash length:', hash.length);
        return hash;
    };

    RefreshToken.verifyTokenHash = async (token, hash) => {
        if (!token || !hash) throw new Error('Token and hash required');
        console.log('[DEBUG][RefreshToken.verifyTokenHash] token len:', token.length, 'hash len:', hash.length);
        const res = await bcrypt.compare(token, hash);
        console.log('[DEBUG][RefreshToken.verifyTokenHash] compare result:', res);
        return res;
    };

    return RefreshToken;
};
