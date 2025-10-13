import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Op } from 'sequelize';
import db from '../models/index.js';
import HttpError from '../utils/HttpError.js';

const { User, Role, RefreshToken } = db;

const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || '15m';
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// LOGIN
export const login = async ({ usernameOrEmail, password }) => {
    console.log('[DEBUG][authService] Login attempt for:', usernameOrEmail);

    const user = await User.findOne({
        where: { [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }] },
        attributes: { include: ['password'] },
        include: [{ model: Role, through: { attributes: [] } }]
    });

    if (!user) throw new HttpError('Invalid credentials', 401);

    const bcrypt = await import('bcrypt');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new HttpError('Invalid credentials', 401);

    const roles = user.Roles.map(r => r.name);

    const accessToken = jwt.sign(
        { id: user.id, username: user.username, roles },
        process.env.JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_TTL }
    );

    const refreshTokenPlain = crypto.randomBytes(64).toString('hex');
    const tokenId = RefreshToken.tokenIdFromToken(refreshTokenPlain);
    const tokenHash = await RefreshToken.hashToken(refreshTokenPlain);

    await RefreshToken.destroy({ where: { userId: user.id } });

    await RefreshToken.create({
        tokenId,
        tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
    });

    return { accessToken, refreshToken: refreshTokenPlain };
};

export const refreshToken = async (token) => {
    if (!token) throw new HttpError('Refresh token missing', 401);

    const tokenId = RefreshToken.tokenIdFromToken(token);

    const stored = await RefreshToken.findOne({
        where: { tokenId, expiresAt: { [Op.gt]: new Date() } }
    });

    if (!stored) throw new HttpError('Invalid or expired refresh token', 401);

    const match = await RefreshToken.verifyTokenHash(token, stored.tokenHash);
    if (!match) throw new HttpError('Invalid refresh token', 401);

    const user = await User.findByPk(stored.userId, {
        include: [{ model: Role, through: { attributes: [] } }]
    });
    if (!user) throw new HttpError('User not found', 404);

    const roles = user.Roles.map(r => r.name);

    const accessToken = jwt.sign(
        { id: user.id, username: user.username, roles },
        process.env.JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_TTL }
    );

    const newRefreshTokenPlain = crypto.randomBytes(64).toString('hex');
    const newTokenId = RefreshToken.tokenIdFromToken(newRefreshTokenPlain);
    const newTokenHash = await RefreshToken.hashToken(newRefreshTokenPlain);

    await stored.destroy();

    await RefreshToken.create({
        tokenId: newTokenId,
        tokenHash: newTokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
    });

    console.log('[DEBUG][authService] Generated new refreshToken hash length:', newTokenHash.length);

    return { accessToken, refreshToken: newRefreshTokenPlain };
};

export const logout = async (token) => {
    if (!token) return { message: 'Logged out successfully' };

    const tokenId = RefreshToken.tokenIdFromToken(token);
    const stored = await RefreshToken.findOne({ where: { tokenId } });

    if (stored) {
        console.log('[DEBUG][authService] Deleting refresh token for userId:', stored.userId);
        await stored.destroy();
    }

    return { message: 'Logged out successfully' };
};
