/**
 * Rutas para el dashboard administrativo
 * Proporciona estadísticas consolidadas para el panel de administración
 */

import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import db from '../models/index.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { Op } from 'sequelize';

const router = express.Router();
const { User, Product, Category, Order } = db;

/**
 * @route   GET /api/dashboard/stats
 * @desc    Obtener estadísticas generales del dashboard
 * @access  Admin
 */
router.get('/stats',
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
        // Obtener contadores en paralelo
        const [
            totalUsers,
            totalProducts,
            totalCategories,
            lowStockCount,
            orderStats
        ] = await Promise.all([
            // Total de usuarios
            User.count(),

            // Total de productos
            Product.count(),

            // Total de categorías
            Category.count(),

            // Productos con stock bajo (≤ 10)
            Product.count({
                where: {
                    stock: {
                        [Op.lte]: 10
                    }
                }
            }),

            // Estadísticas de órdenes agrupadas por estado
            Order.findAll({
                attributes: [
                    'status',
                    [db.sequelize.fn('COUNT', db.sequelize.col('order_id')), 'count'],
                    [db.sequelize.fn('SUM', db.sequelize.col('total_amount')), 'total']
                ],
                group: ['status'],
                raw: true
            })
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalProducts,
                totalCategories,
                lowStockCount,
                orders: orderStats
            }
        });
    })
);

/**
 * @route   GET /api/dashboard/low-stock
 * @desc    Obtener productos con stock bajo
 * @access  Admin
 * @query   threshold - Umbral de stock (por defecto 10)
 * @query   limit - Límite de resultados (por defecto 10)
 */
router.get('/low-stock',
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
        const threshold = parseInt(req.query.threshold) || 10;
        const limit = parseInt(req.query.limit) || 10;

        const products = await Product.findAll({
            where: {
                stock: {
                    [Op.lte]: threshold
                }
            },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['category_id', 'name']
                }
            ],
            order: [['stock', 'ASC']], // Los de menor stock primero
            limit,
            attributes: [
                'product_id',
                'name',
                'sku',
                'stock',
                'price',
                'category_id'
            ]
        });

        res.status(200).json({
            success: true,
            data: products,
            count: products.length
        });
    })
);

/**
 * @route   GET /api/dashboard/recent-orders
 * @desc    Obtener pedidos recientes
 * @access  Admin
 * @query   limit - Límite de resultados (por defecto 5)
 */
router.get('/recent-orders',
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
        const limit = parseInt(req.query.limit) || 5;

        const orders = await Order.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['user_id', 'name', 'email']
                }
            ],
            order: [['created_at', 'DESC']],
            limit,
            attributes: [
                'order_id',
                'user_id',
                'total_amount',
                'status',
                'created_at'
            ]
        });

        res.status(200).json({
            success: true,
            data: orders,
            count: orders.length
        });
    })
);

export default router;
