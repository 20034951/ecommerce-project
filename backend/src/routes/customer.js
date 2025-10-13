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

export default router;