import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import db from '../models/index.js';
import emailService from './emailService.js';
import HttpError from '../utils/HttpError.js';

const { User, PasswordResetToken } = db;

class PasswordResetService {
    /**
     * Solicita un token de recuperación de contraseña
     * @param {string} email - Email del usuario
     * @returns {Object} Resultado de la operación
     */
    async requestPasswordReset(email) {
        try {
            // Buscar usuario por email
            const user = await User.findOne({
                where: {
                    email: email.toLowerCase().trim(),
                    isActive: true
                }
            });

            // Por seguridad, siempre devolvemos éxito aunque el usuario no exista
            if (!user) {
                return {
                    success: true,
                    message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña'
                };
            }

            // Generar token único
            const token = crypto.randomBytes(32).toString('hex');
            
            // Calcular tiempo de expiración (15 minutos)
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 15);

            // Invalidar tokens previos del usuario
            await PasswordResetToken.update(
                { used: true, used_at: new Date() },
                { where: { user_id: user.user_id, used: false } }
            );

            // Crear nuevo token
            await PasswordResetToken.create({
                user_id: user.user_id,
                token,
                expires_at: expiresAt
            });

            // Enviar email
            await emailService.sendPasswordResetEmail(
                user.email,
                token,
                user.name
            );

            return {
                success: true,
                message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña'
            };
        } catch (error) {
            console.error('Password reset request error:', error);
            throw new HttpError(500, 'Error al procesar solicitud de recuperación');
        }
    }

    /**
     * Valida si un token es válido
     * @param {string} token - Token a validar
     * @returns {Object} Información del token y usuario
     */
    async validateToken(token) {
        try {
            if (!token) {
                throw new HttpError(400, 'Token requerido');
            }

            const resetToken = await PasswordResetToken.findOne({
                where: {
                    token,
                    used: false,
                    expires_at: {
                        [Op.gt]: new Date()
                    }
                },
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['user_id', 'email', 'name']
                }]
            });

            if (!resetToken) {
                throw new HttpError(400, 'Token inválido o expirado');
            }

            return {
                valid: true,
                user: resetToken.user,
                tokenInfo: {
                    created_at: resetToken.created_at,
                    expires_at: resetToken.expires_at
                }
            };
        } catch (error) {
            if (error instanceof HttpError) {
                throw error;
            }
            console.error('Token validation error:', error);
            throw new HttpError(500, 'Error al validar token');
        }
    }

    /**
     * Cambia la contraseña usando un token de recuperación
     * @param {string} token - Token de recuperación
     * @param {string} newPassword - Nueva contraseña
     * @returns {Object} Resultado de la operación
     */
    async resetPassword(token, newPassword) {
        try {
            if (!token || !newPassword) {
                throw new HttpError(400, 'Token y nueva contraseña son requeridos');
            }

            if (newPassword.length < 6) {
                throw new HttpError(400, 'La contraseña debe tener al menos 6 caracteres');
            }

            // Validar token
            const validation = await this.validateToken(token);
            if (!validation.valid) {
                throw new HttpError(400, 'Token inválido o expirado');
            }

            const user = validation.user;

            // Hash de la nueva contraseña
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            // Actualizar contraseña del usuario
            await User.update(
                { password_hash: hashedPassword },
                { where: { user_id: user.user_id } }
            );

            // Marcar token como usado
            await PasswordResetToken.update(
                { 
                    used: true,
                    used_at: new Date()
                },
                { where: { token } }
            );

            // Invalidar todas las sesiones activas del usuario
            await db.UserSession.update(
                { is_active: false },
                { where: { user_id: user.user_id, is_active: true } }
            );

            // Enviar email de confirmación
            try {
                await emailService.sendPasswordChangedConfirmation(
                    user.email,
                    user.name
                );
            } catch (emailError) {
                console.error('Error sending confirmation email:', emailError);
                // No fallar la operación si el email falla
            }

            return {
                success: true,
                message: 'Contraseña actualizada exitosamente'
            };
        } catch (error) {
            if (error instanceof HttpError) {
                throw error;
            }
            console.error('Password reset error:', error);
            throw new HttpError(500, 'Error al cambiar contraseña');
        }
    }

    /**
     * Limpia tokens expirados (tarea de mantenimiento)
     */
    async cleanExpiredTokens() {
        try {
            const deletedCount = await PasswordResetToken.destroy({
                where: {
                    expires_at: {
                        [Op.lt]: new Date()
                    }
                }
            });

            console.log(`Cleaned ${deletedCount} expired password reset tokens`);
            return deletedCount;
        } catch (error) {
            console.error('Error cleaning expired tokens:', error);
            throw error;
        }
    }
}

export default new PasswordResetService();