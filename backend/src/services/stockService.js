import db from '../models/index.js';
import HttpError from '../utils/HttpError.js';

const { Product, StockMovement } = db;

class StockService {
    /**
     * Registrar un movimiento de stock
     * @param {Object} movementData - Datos del movimiento
     * @param {number} movementData.productId - ID del producto
     * @param {number} movementData.orderId - ID de la orden (opcional)
     * @param {string} movementData.movementType - Tipo: 'sale', 'cancellation', 'adjustment', 'restock'
     * @param {number} movementData.quantity - Cantidad (negativa para decrementos)
     * @param {string} movementData.notes - Notas adicionales
     * @param {number} movementData.userId - ID del usuario que realiza el movimiento
     * @param {Object} transaction - Transacción de Sequelize (opcional)
     */
    async registerMovement(movementData, transaction = null) {
        const { productId, orderId, movementType, quantity, notes, userId } = movementData;

        // Obtener el producto actual con lock (para evitar condiciones de carrera)
        const product = await Product.findByPk(productId, {
            transaction,
            lock: transaction ? transaction.LOCK.UPDATE : undefined
        });

        if (!product) {
            throw new HttpError(404, `Producto con ID ${productId} no encontrado`);
        }

        const previousStock = product.stock;
        const newStock = previousStock + quantity;

        // Validar que el stock no sea negativo
        if (newStock < 0) {
            throw new HttpError(
                400,
                `Stock insuficiente para el producto "${product.name}". Stock actual: ${previousStock}, requerido: ${Math.abs(quantity)}`
            );
        }

        // Actualizar el stock del producto
        await product.update({ stock: newStock }, { transaction });

        // Registrar el movimiento
        const movement = await StockMovement.create({
            product_id: productId,
            order_id: orderId || null,
            movement_type: movementType,
            quantity: quantity,
            previous_stock: previousStock,
            new_stock: newStock,
            notes: notes || null,
            user_id: userId || null
        }, { transaction });

        return {
            movement,
            product: {
                product_id: product.product_id,
                name: product.name,
                previous_stock: previousStock,
                new_stock: newStock
            }
        };
    }

    /**
     * Reducir stock por venta/pedido
     * @param {number} orderId - ID de la orden
     * @param {Array} items - Items de la orden [{ productId, quantity, name }]
     * @param {number} userId - ID del usuario
     * @param {Object} transaction - Transacción de Sequelize
     */
    async reduceStockForOrder(orderId, items, userId, transaction) {
        const movements = [];

        for (const item of items) {
            const movement = await this.registerMovement({
                productId: item.productId,
                orderId: orderId,
                movementType: 'sale',
                quantity: -item.quantity, // Negativo porque es una salida
                notes: `Venta - Orden #${orderId}`,
                userId: userId
            }, transaction);

            movements.push(movement);
        }

        return movements;
    }

    /**
     * Reponer stock por cancelación de pedido
     * @param {number} orderId - ID de la orden
     * @param {Array} items - Items de la orden [{ productId, quantity, name }]
     * @param {number} userId - ID del usuario
     * @param {Object} transaction - Transacción de Sequelize
     */
    async restoreStockForCancellation(orderId, items, userId, transaction) {
        const movements = [];

        for (const item of items) {
            const movement = await this.registerMovement({
                productId: item.productId,
                orderId: orderId,
                movementType: 'cancellation',
                quantity: item.quantity, // Positivo porque es una entrada
                notes: `Cancelación - Orden #${orderId}`,
                userId: userId
            }, transaction);

            movements.push(movement);
        }

        return movements;
    }

    /**
     * Ajustar stock manualmente
     * @param {number} productId - ID del producto
     * @param {number} quantity - Cantidad a ajustar (+ o -)
     * @param {string} notes - Notas del ajuste
     * @param {number} userId - ID del usuario que realiza el ajuste
     */
    async adjustStock(productId, quantity, notes, userId) {
        const transaction = await db.sequelize.transaction();

        try {
            const movement = await this.registerMovement({
                productId: productId,
                orderId: null,
                movementType: 'adjustment',
                quantity: quantity,
                notes: notes || 'Ajuste manual de inventario',
                userId: userId
            }, transaction);

            await transaction.commit();
            return movement;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Registrar reabastecimiento de stock
     * @param {number} productId - ID del producto
     * @param {number} quantity - Cantidad a reabastecer
     * @param {string} notes - Notas del reabastecimiento
     * @param {number} userId - ID del usuario
     */
    async restockProduct(productId, quantity, notes, userId) {
        const transaction = await db.sequelize.transaction();

        try {
            if (quantity <= 0) {
                throw new HttpError(400, 'La cantidad de reabastecimiento debe ser mayor a 0');
            }

            const movement = await this.registerMovement({
                productId: productId,
                orderId: null,
                movementType: 'restock',
                quantity: quantity,
                notes: notes || 'Reabastecimiento de inventario',
                userId: userId
            }, transaction);

            await transaction.commit();
            return movement;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Obtener historial de movimientos de un producto
     * @param {number} productId - ID del producto
     * @param {Object} filters - Filtros opcionales
     */
    async getProductMovements(productId, filters = {}) {
        const { page = 1, limit = 20, movementType, startDate, endDate, order = 'DESC' } = filters;
        const offset = (page - 1) * limit;

        const whereClause = { product_id: productId };

        if (movementType) {
            whereClause.movement_type = movementType;
        }

        if (startDate || endDate) {
            whereClause.created_at = {};
            if (startDate) {
                whereClause.created_at[db.Sequelize.Op.gte] = new Date(startDate);
            }
            if (endDate) {
                whereClause.created_at[db.Sequelize.Op.lte] = new Date(endDate);
            }
        }

        // Validar que order sea ASC o DESC
        const sortOrder = (order && order.toUpperCase() === 'ASC') ? 'ASC' : 'DESC';

        const { rows: movements, count } = await StockMovement.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['user_id', 'name', 'email']
                },
                {
                    model: db.Order,
                    as: 'order',
                    attributes: ['order_id', 'status', 'created_at']
                }
            ],
            order: [['created_at', sortOrder]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return {
            movements,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        };
    }

    /**
     * Obtener movimientos por orden
     * @param {number} orderId - ID de la orden
     */
    async getOrderMovements(orderId) {
        const movements = await StockMovement.findAll({
            where: { order_id: orderId },
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['product_id', 'name', 'sku', 'stock']
                }
            ],
            order: [['created_at', 'ASC']]
        });

        return movements;
    }

    /**
     * Obtener estadísticas de movimientos
     * @param {Object} filters - Filtros opcionales
     */
    async getMovementStats(filters = {}) {
        const { startDate, endDate, productId } = filters;
        const whereClause = {};

        if (productId) {
            whereClause.product_id = productId;
        }

        if (startDate || endDate) {
            whereClause.created_at = {};
            if (startDate) {
                whereClause.created_at[db.Sequelize.Op.gte] = new Date(startDate);
            }
            if (endDate) {
                whereClause.created_at[db.Sequelize.Op.lte] = new Date(endDate);
            }
        }

        const stats = await StockMovement.findAll({
            where: whereClause,
            attributes: [
                'movement_type',
                [db.sequelize.fn('COUNT', db.sequelize.col('movement_id')), 'count'],
                [db.sequelize.fn('SUM', db.sequelize.col('quantity')), 'total_quantity']
            ],
            group: ['movement_type']
        });

        return stats;
    }
}

export default new StockService();
