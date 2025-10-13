import authService from '../services/authService.js';
import db from '../models/index.js';
import HttpError from '../utils/HttpError.js';

const { User } = db;

// Middleware para verificar autenticación
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            console.log('No se encontró token en la petición');
            throw new HttpError(401, 'Token de acceso requerido');
        }

        console.log('Verificando token...');
        // Verificar token
        const decoded = authService.verifyToken(token);
        console.log('Token decodificado:', { user_id: decoded.user_id, tokenId: decoded.tokenId });
        
        // Verificar si la sesión está activa
        const isActive = await authService.isSessionActive(decoded.tokenId);
        if (!isActive) {
            console.log('Sesión no activa');
            throw new HttpError(401, 'Sesión expirada o inválida');
        }

        // Obtener usuario actualizado
        const user = await User.findByPk(decoded.user_id, {
            attributes: { exclude: ['password_hash'] }
        });

        if (!user || !user.isActive) {
            console.log('Usuario no encontrado o inactivo');
            throw new HttpError(401, 'Usuario no encontrado o inactivo');
        }

        // Actualizar actividad de la sesión
        await authService.updateSessionActivity(decoded.tokenId);

        // Agregar información del usuario a la request
        req.user = user;
        req.tokenId = decoded.tokenId;
        
        console.log('Autenticación exitosa para usuario:', user.email);
        next();
    } catch (error) {
        console.log('Error en autenticación:', error.message);
        if (error instanceof HttpError) {
            return res.status(error.statusCode).json({ 
                error: error.message 
            });
        }
        
        return res.status(401).json({ 
            error: 'Token inválido o expirado' 
        });
    }
};

// Middleware para verificar roles específicos
export const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                error: 'Autenticación requerida' 
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: 'No tienes permisos para acceder a este recurso' 
            });
        }

        next();
    };
};

// Middleware específicos para roles comunes
export const requireAdmin = requireRole('admin');
export const requireEditor = requireRole('admin', 'editor');
export const requireCustomer = requireRole('admin', 'editor', 'customer');

// Middleware para verificar que el usuario accede a sus propios recursos
export const requireOwnership = (userIdField = 'user_id') => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                error: 'Autenticación requerida' 
            });
        }

        // Admin puede acceder a todo
        if (req.user.role === 'admin') {
            return next();
        }

        // Verificar ownership basado en el ID en params o body
        const targetUserId = req.params[userIdField] || req.body[userIdField];
        
        if (targetUserId && parseInt(targetUserId) !== req.user.user_id) {
            return res.status(403).json({ 
                error: 'No puedes acceder a recursos de otros usuarios' 
            });
        }

        next();
    };
};

// Middleware opcional de autenticación (no falla si no hay token)
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = authService.verifyToken(token);
            
            // Verificar si la sesión está activa
            const isActive = await authService.isSessionActive(decoded.tokenId);
            
            if (isActive) {
                const user = await User.findByPk(decoded.user_id, {
                    attributes: { exclude: ['password_hash'] }
                });

                if (user && user.isActive) {
                    req.user = user;
                    req.tokenId = decoded.tokenId;
                    await authService.updateSessionActivity(decoded.tokenId);
                }
            }
        }
    } catch (error) {
        // Ignorar errores en autenticación opcional
    }
    
    next();
};

export default {
    authenticateToken,
    requireRole,
    requireAdmin,
    requireEditor,
    requireCustomer,
    requireOwnership,
    optionalAuth
};