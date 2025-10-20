import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import HttpError from '../utils/HttpError.js';
import db from '../models/index.js';

const router = express.Router();
const { ShippingMethod } = db;

// Cache Keys
const CACHE_KEY_ALL = 'shipping-methods:all';
const CACHE_KEY_BY_ID = (id) => `shipping-method:${id}`;
const CACHE_TTL = 300; // 5 minutos

// ============================================
// RUTAS DE ADMINISTRADOR
// ============================================

/**
 * @route GET /api/shipping-methods/admin
 * @desc Get all shipping methods (Admin)
 * @access Private/Admin
 */
router.get('/admin',
    authenticateToken,
    requireAdmin,
    cacheMiddleware(CACHE_KEY_ALL, CACHE_TTL),
    asyncHandler(async (req, res) => {
        const shippingMethods = await ShippingMethod.findAll({
            order: [['name', 'ASC']]
        });
        res.status(200).json(shippingMethods);
    })
);

/**
 * @route GET /api/shipping-methods/admin/:id
 * @desc Get shipping method by id (Admin)
 * @access Private/Admin
 */
router.get('/admin/:id',
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
        const shippingMethod = await ShippingMethod.findByPk(req.params.id);
        
        if (!shippingMethod) {
            throw new HttpError(404, 'Método de envío no encontrado');
        }
        
        res.status(200).json(shippingMethod);
    })
);

/**
 * @route POST /api/shipping-methods/admin
 * @desc Create new shipping method
 * @access Private/Admin
 */
router.post('/admin',
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
        const { name, cost, region } = req.body;
        
        // Validaciones
        if (!name || !cost) {
            throw new HttpError(400, 'Nombre y costo son requeridos');
        }
        
        if (isNaN(cost) || parseFloat(cost) < 0) {
            throw new HttpError(400, 'El costo debe ser un número válido mayor o igual a 0');
        }
        
        // Verificar si ya existe un método con el mismo nombre
        const existing = await ShippingMethod.findOne({ where: { name } });
        if (existing) {
            throw new HttpError(400, 'Ya existe un método de envío con ese nombre');
        }
        
        const shippingMethod = await ShippingMethod.create({
            name,
            cost: parseFloat(cost),
            region: region || null
        });
        
        await invalidateCache([CACHE_KEY_ALL]);
        
        res.status(201).json(shippingMethod);
    })
);

/**
 * @route PUT /api/shipping-methods/admin/:id
 * @desc Update shipping method
 * @access Private/Admin
 */
router.put('/admin/:id',
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
        const { name, cost, region } = req.body;
        
        const shippingMethod = await ShippingMethod.findByPk(req.params.id);
        
        if (!shippingMethod) {
            throw new HttpError(404, 'Método de envío no encontrado');
        }
        
        // Validaciones
        if (name !== undefined && !name.trim()) {
            throw new HttpError(400, 'El nombre no puede estar vacío');
        }
        
        if (cost !== undefined) {
            if (isNaN(cost) || parseFloat(cost) < 0) {
                throw new HttpError(400, 'El costo debe ser un número válido mayor o igual a 0');
            }
        }
        
        // Verificar si el nuevo nombre ya existe en otro método
        if (name && name !== shippingMethod.name) {
            const existing = await ShippingMethod.findOne({ 
                where: { 
                    name,
                    shipping_method_id: { [db.Sequelize.Op.ne]: req.params.id }
                } 
            });
            if (existing) {
                throw new HttpError(400, 'Ya existe otro método de envío con ese nombre');
            }
        }
        
        // Actualizar campos
        if (name !== undefined) shippingMethod.name = name;
        if (cost !== undefined) shippingMethod.cost = parseFloat(cost);
        if (region !== undefined) shippingMethod.region = region || null;
        
        await shippingMethod.save();
        
        await invalidateCache([CACHE_KEY_ALL, CACHE_KEY_BY_ID(req.params.id)]);
        
        res.status(200).json(shippingMethod);
    })
);

/**
 * @route DELETE /api/shipping-methods/admin/:id
 * @desc Delete shipping method
 * @access Private/Admin
 */
router.delete('/admin/:id',
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
        const shippingMethod = await ShippingMethod.findByPk(req.params.id);
        
        if (!shippingMethod) {
            throw new HttpError(404, 'Método de envío no encontrado');
        }
        
        // Verificar si hay pedidos asociados
        const ordersCount = await db.Order.count({
            where: { shipping_method_id: req.params.id }
        });
        
        if (ordersCount > 0) {
            throw new HttpError(400, 
                `No se puede eliminar el método de envío porque tiene ${ordersCount} pedido(s) asociado(s)`
            );
        }
        
        await shippingMethod.destroy();
        
        await invalidateCache([CACHE_KEY_ALL, CACHE_KEY_BY_ID(req.params.id)]);
        
        res.status(200).json({ 
            message: 'Método de envío eliminado exitosamente',
            shipping_method_id: parseInt(req.params.id)
        });
    })
);

export default router;
