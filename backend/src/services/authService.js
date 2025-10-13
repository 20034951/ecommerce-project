import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import db from '../models/index.js';

const { User, UserSession } = db;

class AuthService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
        this.jwtExpiry = process.env.JWT_EXPIRY || '24h';
        this.refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || '7d';
    }

    // Generar hash de contraseña
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(12);
        return bcrypt.hash(password, salt);
    }

    // Verificar contraseña
    async verifyPassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }

    // Generar tokens JWT
    generateTokens(user) {
        const tokenId = uuidv4();
        
        const payload = {
            user_id: user.user_id,
            email: user.email,
            role: user.role,
            tokenId: tokenId
        };

        const accessToken = jwt.sign(payload, this.jwtSecret, {
            expiresIn: this.jwtExpiry,
            issuer: 'ecommerce-api',
            audience: 'ecommerce-client'
        });

        const refreshToken = jwt.sign(
            { user_id: user.user_id, tokenId: tokenId },
            this.jwtSecret,
            { expiresIn: this.refreshTokenExpiry }
        );

        return {
            accessToken,
            refreshToken,
            tokenId,
            expiresIn: this.jwtExpiry
        };
    }

    // Verificar token JWT
    verifyToken(token) {
        try {
            return jwt.verify(token, this.jwtSecret, {
                issuer: 'ecommerce-api',
                audience: 'ecommerce-client'
            });
        } catch (error) {
            throw new Error('Token inválido o expirado');
        }
    }

    // Verificar refresh token JWT
    verifyRefreshToken(token) {
        try {
            return jwt.verify(token, this.jwtSecret);
        } catch (error) {
            throw new Error('Refresh token inválido o expirado');
        }
    }

    // Registrar nueva sesión
    async createSession(user, tokenId, req) {
        const userAgent = req.get('User-Agent') || '';
        const ipAddress = req.clientIP || req.ip || req.connection.remoteAddress;
        
        // Calcular fecha de expiración basada en jwtExpiry
        const expiresAt = new Date();
        
        // Parsear jwtExpiry más robustamente
        const expiry = this.jwtExpiry;
        if (expiry.includes('h')) {
            const hours = parseInt(expiry.replace('h', ''));
            expiresAt.setHours(expiresAt.getHours() + hours);
        } else if (expiry.includes('d')) {
            const days = parseInt(expiry.replace('d', ''));
            expiresAt.setDate(expiresAt.getDate() + days);
        } else if (expiry.includes('m')) {
            const minutes = parseInt(expiry.replace('m', ''));
            expiresAt.setMinutes(expiresAt.getMinutes() + minutes);
        } else {
            // Default: 24 horas si no se puede parsear
            expiresAt.setHours(expiresAt.getHours() + 24);
        }

        console.log(`Creando sesión para usuario ${user.user_id}, expira: ${expiresAt.toISOString()}`);

        const session = await UserSession.create({
            user_id: user.user_id,
            token_id: tokenId,
            device_info: this.extractDeviceInfo(userAgent),
            ip_address: ipAddress,
            user_agent: userAgent,
            expires_at: expiresAt,
            is_active: true,
            last_activity: new Date()
        });

        return session;
    }

    // Extraer información del dispositivo
    extractDeviceInfo(userAgent) {
        let deviceInfo = 'Desconocido';
        
        if (userAgent.includes('Mobile')) {
            deviceInfo = 'Móvil';
        } else if (userAgent.includes('Tablet')) {
            deviceInfo = 'Tablet';
        } else if (userAgent.includes('Desktop') || userAgent.includes('Mozilla')) {
            deviceInfo = 'Escritorio';
        }

        // Detectar navegador
        if (userAgent.includes('Chrome')) {
            deviceInfo += ' - Chrome';
        } else if (userAgent.includes('Firefox')) {
            deviceInfo += ' - Firefox';
        } else if (userAgent.includes('Safari')) {
            deviceInfo += ' - Safari';
        } else if (userAgent.includes('Edge')) {
            deviceInfo += ' - Edge';
        }

        return deviceInfo;
    }

    // Actualizar actividad de sesión
    async updateSessionActivity(tokenId) {
        await UserSession.update(
            { last_activity: new Date() },
            { where: { token_id: tokenId, is_active: true } }
        );
    }

    // Cerrar sesión
    async logout(tokenId) {
        await UserSession.update(
            { is_active: false },
            { where: { token_id: tokenId } }
        );
    }

    // Cerrar todas las sesiones de un usuario
    async logoutAllSessions(userId) {
        await UserSession.update(
            { is_active: false },
            { where: { user_id: userId } }
        );
    }

    // Revocar sesión específica (para admin)
    async revokeSession(sessionId) {
        const session = await UserSession.findByPk(sessionId);
        if (!session) {
            throw new Error('Sesión no encontrada');
        }

        await UserSession.update(
            { is_active: false },
            { where: { session_id: sessionId } }
        );

        return session;
    }

    // Obtener sesiones activas de un usuario
    async getUserSessions(userId) {
        return await UserSession.findAll({
            where: { 
                user_id: userId,
                is_active: true 
            },
            order: [['last_activity', 'DESC']],
            attributes: [
                'session_id',
                'device_info',
                'ip_address',
                'created_at',
                'last_activity',
                'expires_at'
            ]
        });
    }

    // Obtener todas las sesiones activas (para admin)
    async getAllActiveSessions() {
        return await UserSession.findAll({
            where: { is_active: true },
            include: [{
                model: User,
                as: 'user',
                attributes: ['user_id', 'name', 'email', 'role']
            }],
            order: [['last_activity', 'DESC']],
            attributes: [
                'session_id',
                'device_info',
                'ip_address',
                'created_at',
                'last_activity',
                'expires_at'
            ]
        });
    }

    // Limpiar sesiones expiradas
    async cleanExpiredSessions() {
        const now = new Date();
        await UserSession.update(
            { is_active: false },
            { 
                where: { 
                    expires_at: { [db.Sequelize.Op.lt]: now },
                    is_active: true 
                } 
            }
        );
    }

    // Validar si la sesión está activa
    async isSessionActive(tokenId) {
        const session = await UserSession.findOne({
            where: { 
                token_id: tokenId,
                is_active: true 
            }
        });

        if (!session) {
            console.log(`Sesión no encontrada para tokenId: ${tokenId}`);
            return false;
        }

        // Verificar si no ha expirado
        const now = new Date();
        console.log(`Verificando expiración: now=${now.toISOString()}, expires_at=${session.expires_at.toISOString()}`);
        
        if (now > session.expires_at) {
            console.log(`Sesión expirada para tokenId: ${tokenId}`);
            await this.logout(tokenId);
            return false;
        }

        console.log(`Sesión activa para tokenId: ${tokenId}`);
        return true;
    }
}

export default new AuthService();