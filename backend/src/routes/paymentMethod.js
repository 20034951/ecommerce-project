import express from 'express';
import paymentMethodService from '../services/paymentMethodService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/payment-methods
 * @desc    Obtener todos los métodos de pago (paginados)
 * @access  Public
 */
router.get(
    '/',
    asyncHandler(async (req, res) => {
        const result = await paymentMethodService.getAll(req.query);
        res.json(result);
    })
);

/**
 * @route   GET /api/payment-methods/active
 * @desc    Obtener métodos de pago activos (sin paginación)
 * @access  Public
 */
router.get(
    '/active',
    asyncHandler(async (req, res) => {
        const paymentMethods = await paymentMethodService.getActive();
        res.json(paymentMethods);
    })
);

/**
 * @route   GET /api/payment-methods/:id
 * @desc    Obtener un método de pago por ID
 * @access  Public
 */
router.get(
    '/:id',
    asyncHandler(async (req, res) => {
        const paymentMethod = await paymentMethodService.getById(req.params.id);
        res.json(paymentMethod);
    })
);

/**
 * @route   POST /api/payment-methods
 * @desc    Crear un nuevo método de pago
 * @access  Private/Admin
 */
router.post(
    '/',
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
        const paymentMethod = await paymentMethodService.create(req.body);
        res.status(201).json(paymentMethod);
    })
);

/**
 * @route   PUT /api/payment-methods/:id
 * @desc    Actualizar un método de pago
 * @access  Private/Admin
 */
router.put(
    '/:id',
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
        const paymentMethod = await paymentMethodService.update(req.params.id, req.body);
        res.json(paymentMethod);
    })
);

/**
 * @route   DELETE /api/payment-methods/:id
 * @desc    Desactivar un método de pago
 * @access  Private/Admin
 */
router.delete(
    '/:id',
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
        const result = await paymentMethodService.delete(req.params.id);
        res.json(result);
    })
);

/**
 * @route   PATCH /api/payment-methods/:id/activate
 * @desc    Activar un método de pago
 * @access  Private/Admin
 */
router.patch(
    '/:id/activate',
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
        const paymentMethod = await paymentMethodService.activate(req.params.id);
        res.json(paymentMethod);
    })
);

export default router;
