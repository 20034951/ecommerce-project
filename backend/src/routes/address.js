import express from 'express';
import { authenticateToken, requireCustomer } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import addressService from '../services/addressService.js';

const router = express.Router();

/**
 * @route   GET /api/addresses
 * @desc    Obtener todas las direcciones del usuario autenticado
 * @access  Private (Customer)
 */
router.get('/',
    authenticateToken,
    requireCustomer,
    asyncHandler(async (req, res) => {
        const userId = req.user.user_id;
        const { type } = req.query; // Filtrar por tipo: shipping o billing

        const addresses = await addressService.getUserAddresses(userId, type);

        res.json({
            success: true,
            data: addresses
        });
    })
);

/**
 * @route   GET /api/addresses/:id
 * @desc    Obtener una dirección específica
 * @access  Private (Customer)
 */
router.get('/:id',
    authenticateToken,
    requireCustomer,
    asyncHandler(async (req, res) => {
        const userId = req.user.user_id;
        const { id } = req.params;

        const address = await addressService.getAddressById(id, userId);

        res.json({
            success: true,
            data: address
        });
    })
);

/**
 * @route   POST /api/addresses
 * @desc    Crear una nueva dirección
 * @access  Private (Customer)
 */
router.post('/',
    authenticateToken,
    requireCustomer,
    asyncHandler(async (req, res) => {
        const userId = req.user.user_id;
        const addressData = req.body;

        const newAddress = await addressService.createAddress(addressData, userId);

        res.status(201).json({
            success: true,
            message: 'Dirección creada exitosamente',
            data: newAddress
        });
    })
);

/**
 * @route   PUT /api/addresses/:id
 * @desc    Actualizar una dirección existente
 * @access  Private (Customer)
 */
router.put('/:id',
    authenticateToken,
    requireCustomer,
    asyncHandler(async (req, res) => {
        const userId = req.user.user_id;
        const { id } = req.params;
        const addressData = req.body;

        const updatedAddress = await addressService.updateAddress(id, addressData, userId);

        res.json({
            success: true,
            message: 'Dirección actualizada exitosamente',
            data: updatedAddress
        });
    })
);

/**
 * @route   DELETE /api/addresses/:id
 * @desc    Eliminar una dirección
 * @access  Private (Customer)
 */
router.delete('/:id',
    authenticateToken,
    requireCustomer,
    asyncHandler(async (req, res) => {
        const userId = req.user.user_id;
        const { id } = req.params;

        await addressService.deleteAddress(id, userId);

        res.json({
            success: true,
            message: 'Dirección eliminada exitosamente'
        });
    })
);

export default router;
