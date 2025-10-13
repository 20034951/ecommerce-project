import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { invalidateCache } from '../middleware/cache.js';
import { authenticateToken, requireCustomer } from '../middleware/auth.js';
import HttpError from '../utils/HttpError.js';
import authService from '../services/authService.js';
import { 
    getUserById,
    updateUser,
    terminateAllUserSessions
} from '../services/userService.js';

const router = express.Router();

const CACHE_KEY_ALL = 'users:all';
const CACHE_KEY_BY_ID = (id) => `users:${id}`;

/**
 * @route GET /api/customers/profile
 * @desc Get current customer's profile
 */
router.get('/profile',
    authenticateToken,
    requireCustomer,
    asyncHandler(async (req, res) => {
        const userId = req.user.user_id;
        const user = await getUserById(userId);
        
        res.status(200).json({
            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    })
);

/**
 * @route PUT /api/customers/profile
 * @desc Update current customer's profile
 */
router.put('/profile',
    authenticateToken,
    requireCustomer,
    asyncHandler(async (req, res) => {
        const { name, phone, email } = req.body;
        const userId = req.user.user_id;
        const currentEmail = req.user.email;

        // Validar que solo se envíen los campos permitidos
        const allowedFields = { name, phone, email };
        const updateData = {};
        
        // Solo incluir campos que están presentes y no son undefined
        Object.keys(allowedFields).forEach(key => {
            if (allowedFields[key] !== undefined) {
                updateData[key] = allowedFields[key];
            }
        });

        // Validaciones básicas
        if (updateData.name && (updateData.name.length < 2 || updateData.name.length > 50)) {
            throw new HttpError(400, 'El nombre debe tener entre 2 y 50 caracteres');
        }

        if (updateData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateData.email)) {
            throw new HttpError(400, 'El email tiene un formato inválido');
        }

        if (updateData.phone && updateData.phone.length > 0 && !/^\+?[\d\s\-\(\)]+$/.test(updateData.phone)) {
            throw new HttpError(400, 'El formato del teléfono es inválido');
        }

        // Verificar si el email ya existe (si se está cambiando)
        if (updateData.email && updateData.email !== currentEmail) {
            const existingUser = await getUserById(null, { email: updateData.email });
            if (existingUser) {
                throw new HttpError(400, 'El email ya está en uso por otro usuario');
            }
        }

        // Actualizar usuario
        const updatedUser = await updateUser(userId, updateData);
        
        // Si se cambió el email, cerrar todas las sesiones del usuario
        const emailChanged = updateData.email && updateData.email !== currentEmail;
        if (emailChanged) {
            await terminateAllUserSessions(userId);
        }

        // Limpiar cache
        await invalidateCache([CACHE_KEY_ALL, CACHE_KEY_BY_ID(userId)]);

        res.status(200).json({
            message: emailChanged 
                ? 'Perfil actualizado. Por favor, inicia sesión nuevamente con tu nuevo email.' 
                : 'Perfil actualizado exitosamente',
            user: {
                user_id: updatedUser.user_id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role
            },
            emailChanged
        });
    })
);

/**
 * @route GET /api/customers/sessions
 * @desc Get current customer's active sessions
 */
router.get('/sessions',
    authenticateToken,
    requireCustomer,
    asyncHandler(async (req, res) => {
        const userId = req.user.user_id;
        const sessions = await authService.getUserSessions(userId);
        
        res.status(200).json({
            sessions: sessions.map(session => ({
                session_id: session.session_id,
                created_at: session.created_at,
                expires_at: session.expires_at,
                ip_address: session.ip_address,
                user_agent: session.user_agent,
                is_current: session.session_id === req.tokenId
            }))
        });
    })
);

/**
 * @route DELETE /api/customers/sessions/:sessionId
 * @desc Terminate a specific customer session
 */
router.delete('/sessions/:sessionId',
    authenticateToken,
    requireCustomer,
    asyncHandler(async (req, res) => {
        const { sessionId } = req.params;
        const userId = req.user.user_id;
        
        console.log('🔍 Intentando cerrar sesión:', {
            sessionId,
            userId,
            sessionIdType: typeof sessionId
        });
        
        // Obtener las sesiones del usuario para verificar que la sesión le pertenece
        const sessions = await authService.getUserSessions(userId);
        
        console.log('📋 Sesiones disponibles:', sessions.map(s => ({
            id: s.session_id,
            type: typeof s.session_id,
            match: s.session_id === sessionId,
            strictMatch: s.session_id.toString() === sessionId.toString()
        })));
        
        // Buscar la sesión con comparación más flexible
        const targetSession = sessions.find(session => 
            session.session_id.toString() === sessionId.toString()
        );
        
        if (!targetSession) {
            console.log('❌ Sesión no encontrada. Comparando:');
            console.log('  - sessionId buscado:', sessionId);
            console.log('  - sessionIds disponibles:', sessions.map(s => s.session_id));
            throw new HttpError(404, 'Sesión no encontrada o no pertenece a este usuario');
        }
        
        console.log('✅ Sesión encontrada, revocando...');
        
        // Revocar la sesión
        await authService.revokeSession(sessionId);
        
        res.status(200).json({
            message: 'Sesión cerrada exitosamente'
        });
    })
);

/**
 * @route DELETE /api/customers/sessions
 * @desc Terminate all customer sessions except current
 */
router.delete('/sessions',
    authenticateToken,
    requireCustomer,
    asyncHandler(async (req, res) => {
        const userId = req.user.user_id;
        const currentSessionId = req.tokenId;
        
        console.log('🔍 Cerrando todas las sesiones excepto:', {
            currentSessionId,
            userId,
            currentSessionIdType: typeof currentSessionId
        });
        
        // Obtener todas las sesiones del usuario
        const sessions = await authService.getUserSessions(userId);
        
        // Cerrar todas las sesiones excepto la actual (usando comparación más flexible)
        const sessionsToClose = sessions.filter(session => 
            session.session_id.toString() !== currentSessionId.toString()
        );
        
        console.log('📋 Sesiones a cerrar:', sessionsToClose.map(s => s.session_id));
        
        for (const session of sessionsToClose) {
            await authService.revokeSession(session.session_id);
        }
        
        res.status(200).json({
            message: `Se cerraron ${sessionsToClose.length} sesiones`,
            closedSessions: sessionsToClose.length
        });
    })
);

/**
 * @route PUT /api/customers/password
 * @desc Change customer password
 */
router.put('/password',
    authenticateToken,
    requireCustomer,
    asyncHandler(async (req, res) => {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.user_id;
        
        // Validaciones básicas
        if (!currentPassword || !newPassword) {
            throw new HttpError(400, 'Contraseña actual y nueva contraseña son requeridas');
        }
        
        if (newPassword.length < 6) {
            throw new HttpError(400, 'La nueva contraseña debe tener al menos 6 caracteres');
        }
        
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
            throw new HttpError(400, 'La nueva contraseña debe contener al menos una mayúscula, una minúscula y un número');
        }
        
        // Obtener usuario con password
        const user = await getUserById(userId, {}, true); // true para incluir password
        
        // Verificar contraseña actual
        const isValidPassword = await authService.verifyPassword(currentPassword, user.password_hash);
        if (!isValidPassword) {
            throw new HttpError(400, 'La contraseña actual es incorrecta');
        }
        
        // Hash de la nueva contraseña
        const newPasswordHash = await authService.hashPassword(newPassword);
        
        // Actualizar contraseña
        await updateUser(userId, { password_hash: newPasswordHash });
        
        // Cerrar todas las sesiones excepto la actual para forzar re-login
        const currentSessionId = req.tokenId;
        const sessions = await authService.getUserSessions(userId);
        const sessionsToClose = sessions.filter(session => session.session_id !== currentSessionId);
        
        for (const session of sessionsToClose) {
            await authService.revokeSession(session.session_id);
        }
        
        res.status(200).json({
            message: 'Contraseña actualizada exitosamente. Se cerraron todas las demás sesiones.',
            closedSessions: sessionsToClose.length
        });
    })
);

export default router;