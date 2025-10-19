import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { login, refreshToken, logout } from '../services/authService.js';
import HttpError from '../utils/HttpError.js';

const router = express.Router();
const DEBUG = true;
const MAX_AGE_TTL_MS = parseInt(7*24*60*60*1000);
const log = (...args) => { if(DEBUG) console.log('[DEBUG][auth.js]', ...args); };

/**
 * @route POST /api/auth/login
 * @desc Login user with valid credentials
 */
router.post('/login', 
    asyncHandler(async (req, res) => {
    
    log('POST /login payload:', req.body);
    
    const { usernameOrEmail, password } = req.body;
    if(!usernameOrEmail || !password) throw new HttpError(400, 'Missing credentials');

    const tokens = await login({ usernameOrEmail, password });

    res.cookie(
        'refreshToken', 
        tokens.refreshToken, 
        { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: MAX_AGE_TTL_MS }
    );
    res.status(200).json({ accessToken: tokens.accessToken });
}));

/**
 * @route POST /api/auth/refresh
 * @desc Issue a new access token with valid refresh token
 */
router.post('/refresh', 
    asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken;
    
    log('POST /refresh, cookie:', token);
    const tokens = await refreshToken(token);
    
    res.cookie(
        'refreshToken', 
        tokens.refreshToken, 
        { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: MAX_AGE_TTL_MS }
    );
    res.status(200).json({ accessToken: tokens.accessToken });
}));

/**
 * @route POST /api/auth/logout
 * @desc Logout user and clear refreshToken cookie
 */
router.post('/logout', 
    asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken;
    
    log('POST /logout, cookie:', token);
    const result = await logout(token);
    
    res.clearCookie('refreshToken');
    res.status(200).json(result);
}));

export default router;
