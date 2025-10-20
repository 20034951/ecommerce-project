<<<<<<< HEAD
import express from 'express';
import orderService from '../services/orderService.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import HttpError from '../utils/HttpError.js';

const router = express.Router();

// ============================================
// RUTAS DE ADMINISTRADOR (DEBEN IR PRIMERO)
// ============================================

/**
 * @route   GET /api/orders/admin/stats
 * @desc    Obtener estadísticas de pedidos
 * @access  Private/Admin
 */
router.get('/admin/stats', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
    const stats = await orderService.getOrderStats();
    
    res.json({
        success: true,
        data: stats
    });
}));

/**
 * @route   GET /api/orders/admin/export
 * @desc    Exportar pedidos a CSV
 * @access  Private/Admin
 */
router.get('/admin/export', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
    const filters = {
        status: req.query.status,
        search: req.query.search,
        userId: req.query.userId,
        startDate: req.query.startDate,
        endDate: req.query.endDate
    };

    const csvData = await orderService.exportOrdersToCSV(filters);
    
    // Configurar headers para descarga de archivo CSV
    const filename = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvData);
}));

/**
 * @route   GET /api/orders/admin/:id
 * @desc    Obtener detalle de cualquier pedido (Admin)
 * @access  Private/Admin
 */
router.get('/admin/:id', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const order = await orderService.getOrderById(orderId, null, true);
    
    res.json({
        success: true,
        data: order
    });
}));

/**
 * @route   GET /api/orders/admin
 * @desc    Obtener todos los pedidos (Admin)
 * @access  Private/Admin
 */
router.get('/admin', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
    const filters = {
        status: req.query.status,
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        userId: req.query.userId,
        startDate: req.query.startDate,
        endDate: req.query.endDate
    };

    const result = await orderService.getAllOrders(filters);
    
    res.json({
        success: true,
        data: result.orders,
        pagination: result.pagination
    });
}));

/**
 * @route   PUT /api/orders/admin/:id/status
 * @desc    Actualizar estado de un pedido (Admin)
 * @access  Private/Admin
 */
router.put('/admin/:id/status', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const userId = req.user.user_id;
    const statusData = {
        status: req.body.status,
        notes: req.body.notes,
        trackingNumber: req.body.trackingNumber,
        trackingUrl: req.body.trackingUrl,
        estimatedDelivery: req.body.estimatedDelivery
    };

    if (!statusData.status) {
        throw new HttpError(400, 'El estado es requerido');
    }

    const order = await orderService.updateOrderStatus(orderId, statusData, userId);
    
    res.json({
        success: true,
        message: 'Estado del pedido actualizado exitosamente',
        data: order
    });
}));

/**
 * @route   PUT /api/orders/admin/:id
 * @desc    Actualizar información de un pedido (Admin)
 * @access  Private/Admin
 */
router.put('/admin/:id', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const userId = req.user.user_id;
    
    // Para actualizaciones generales, usar updateOrderStatus
    const order = await orderService.updateOrderStatus(orderId, req.body, userId);
    
    res.json({
        success: true,
        message: 'Pedido actualizado exitosamente',
        data: order
    });
}));

// ============================================
// RUTAS DE USUARIOS
// ============================================

/**
 * @route   POST /api/orders
 * @desc    Crear un nuevo pedido
 * @access  Private (Usuario autenticado)
 */
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
    const userId = req.user.user_id;
    const order = await orderService.createOrder(req.body, userId);
    
    res.status(201).json({
        success: true,
        data: order
    });
}));

/**
 * @route   GET /api/orders
 * @desc    Obtener pedidos del usuario autenticado
 * @access  Private (Usuario autenticado)
 */
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
    const userId = req.user.user_id;
    const filters = {
        status: req.query.status,
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search
    };

    const result = await orderService.getUserOrders(userId, filters);
    
    res.json({
        success: true,
        data: result.orders,
        pagination: result.pagination
    });
}));

/**
 * @route   GET /api/orders/:id
 * @desc    Obtener detalle de un pedido específico
 * @access  Private (Usuario autenticado, solo sus pedidos)
 */
router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const userId = req.user.user_id;
    const isAdmin = req.user.role === 'admin';

    const order = await orderService.getOrderById(orderId, userId, isAdmin);
    
    res.json({
        success: true,
        data: order
    });
}));

/**
 * @route   PUT /api/orders/:id/cancel
 * @desc    Cancelar un pedido
 * @access  Private (Usuario autenticado, solo sus pedidos)
 */
router.put('/:id/cancel', authenticateToken, asyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const userId = req.user.user_id;
    const { reason } = req.body;

    if (!reason) {
        throw new HttpError(400, 'La razón de cancelación es requerida');
    }

    const order = await orderService.cancelOrder(orderId, userId, reason);
    
    res.json({
        success: true,
        message: 'Pedido cancelado exitosamente',
        data: order
    });
}));

/**
 * @route   GET /api/orders/:id/history
 * @desc    Obtener historial de cambios de un pedido
 * @access  Private (Usuario autenticado, solo sus pedidos)
 */
router.get('/:id/history', authenticateToken, asyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const userId = req.user.user_id;
    const isAdmin = req.user.role === 'admin';

    const history = await orderService.getOrderHistory(orderId, userId, isAdmin);
    
    res.json({
        success: true,
        data: history
    });
}));
=======
import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import { updateOrderStatus } from "../services/orderService.js";
// import db from "../config/db.js";
import db from "../models/index.js";

const router = express.Router();

/**
 * @route POST /api/orders
 * @desc Create new order
 */
router.post(
  "/",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { user_id, address_id, shipping_method_id, coupon_id, items } =
      req.body;

    if (
      !user_id ||
      !address_id ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({ error: "Datos de orden incompletos" });
    }

    // Calcular total
    let totalAmount = 0;
    for (const item of items) {
      totalAmount += item.price * item.quantity;
    }

    // Crear orden
    const order = await db.Order.create({
      user_id,
      address_id,
      shipping_method_id,
      coupon_id,
      total_amount: totalAmount,
      status: "pending",
    });

    // Insertar items
    for (const item of items) {
      await db.OrderItem.create({
        order_id: order.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      });
    }

    res.status(201).json({
      message: "Order created successfully",
      order_id: order.order_id,
      total_amount: totalAmount,
      status: "pending",
    });
  })
);

/**
 * @route PUT /api/orders/:id/status
 * @desc Update order status and send notification email
 */
router.put(
  "/:id/status",
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    const order = await updateOrderStatus(req.params.id, status);
    res.status(200).json({ message: "Order status updated", order });
  })
);
>>>>>>> b0f7616 (Add: order email notification and update README)

export default router;
