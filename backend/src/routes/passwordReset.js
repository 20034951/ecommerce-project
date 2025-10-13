import express from 'express';
import passwordResetService from '../services/passwordResetService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import HttpError from '../utils/HttpError.js';

const router = express.Router();

/**
 * POST /api/auth/forgot-password
 * Solicita un token de recuperación de contraseña
 */
router.post('/forgot-password', asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new HttpError(400, 'Email es requerido');
    }

    const result = await passwordResetService.requestPasswordReset(email);

    res.status(200).json({
        success: true,
        message: result.message
    });
}));

/**
 * POST /api/auth/validate-reset-token
 * Valida si un token de recuperación es válido
 */
router.post('/validate-reset-token', asyncHandler(async (req, res) => {
    const { token } = req.body;

    if (!token) {
        throw new HttpError(400, 'Token es requerido');
    }

    const validation = await passwordResetService.validateToken(token);

    res.status(200).json({
        success: true,
        valid: validation.valid,
        user: validation.user,
        tokenInfo: validation.tokenInfo
    });
}));

/**
 * POST /api/auth/reset-password
 * Cambia la contraseña usando un token de recuperación
 */
router.post('/reset-password', asyncHandler(async (req, res) => {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
        throw new HttpError(400, 'Token, nueva contraseña y confirmación son requeridos');
    }

    if (newPassword !== confirmPassword) {
        throw new HttpError(400, 'Las contraseñas no coinciden');
    }

    const result = await passwordResetService.resetPassword(token, newPassword);

    res.status(200).json({
        success: true,
        message: result.message
    });
}));

/**
 * DELETE /api/auth/clean-expired-tokens
 * Limpia tokens expirados (endpoint de mantenimiento)
 * Nota: En producción esto debería ser una tarea programada
 */
router.delete('/clean-expired-tokens', asyncHandler(async (req, res) => {
    const deletedCount = await passwordResetService.cleanExpiredTokens();

    res.status(200).json({
        success: true,
        message: `Se eliminaron ${deletedCount} tokens expirados`,
        deletedCount
    });
}));

export default router;