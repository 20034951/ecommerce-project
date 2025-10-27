import express from 'express';
import stockService from '../services/stockService.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import HttpError from '../utils/HttpError.js';

const router = express.Router();

/**
 * @route   GET /api/stock/product/:productId/movements
 * @desc    Obtener historial de movimientos de un producto
 * @access  Private/Admin
 */
router.get('/product/:productId/movements', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
    const productId = req.params.productId;
    const filters = {
        page: req.query.page,
        limit: req.query.limit,
        movementType: req.query.movementType,
        startDate: req.query.startDate,
        endDate: req.query.endDate
    };

    const result = await stockService.getProductMovements(productId, filters);

    res.json({
        success: true,
        data: result.movements,
        pagination: result.pagination
    });
}));

/**
 * @route   GET /api/stock/order/:orderId/movements
 * @desc    Obtener movimientos de stock de una orden
 * @access  Private/Admin
 */
router.get('/order/:orderId/movements', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
    const orderId = req.params.orderId;
    const movements = await stockService.getOrderMovements(orderId);

    res.json({
        success: true,
        data: movements
    });
}));

/**
 * @route   POST /api/stock/adjust
 * @desc    Ajustar stock manualmente
 * @access  Private/Admin
 */
router.post('/adjust', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
    const { productId, quantity, notes } = req.body;
    const userId = req.user.user_id;

    if (!productId) {
        throw new HttpError(400, 'El ID del producto es requerido');
    }

    if (quantity === undefined || quantity === 0) {
        throw new HttpError(400, 'La cantidad debe ser diferente de 0');
    }

    const movement = await stockService.adjustStock(productId, quantity, notes, userId);

    res.json({
        success: true,
        message: 'Stock ajustado exitosamente',
        data: movement
    });
}));

/**
 * @route   POST /api/stock/restock
 * @desc    Reabastecer stock de un producto
 * @access  Private/Admin
 */
router.post('/restock', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
    const { productId, quantity, notes } = req.body;
    const userId = req.user.user_id;

    if (!productId) {
        throw new HttpError(400, 'El ID del producto es requerido');
    }

    if (!quantity || quantity <= 0) {
        throw new HttpError(400, 'La cantidad debe ser mayor a 0');
    }

    const movement = await stockService.restockProduct(productId, quantity, notes, userId);

    res.json({
        success: true,
        message: 'Stock reabastecido exitosamente',
        data: movement
    });
}));

/**
 * @route   GET /api/stock/stats
 * @desc    Obtener estadísticas de movimientos de stock
 * @access  Private/Admin
 */
router.get('/stats', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
    const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        productId: req.query.productId
    };

    const stats = await stockService.getMovementStats(filters);

    res.json({
        success: true,
        data: stats
    });
}));

export default router;
