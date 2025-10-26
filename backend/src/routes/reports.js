import express from 'express';
import { Op } from 'sequelize';
import db from '../models/index.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const { Order, OrderItem, Product, Category, User, PaymentMethod, Coupon } = db;

const router = express.Router();

// Todas las rutas requieren autenticación y rol de admin
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * GET /api/reports/sales-summary
 * Resumen general de ventas con ganancias, órdenes completadas, canceladas
 * Incluye estadísticas de métodos de pago y cupones
 * Query params: startDate, endDate (opcional)
 */
router.get('/sales-summary', async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        // Construir filtro de fechas
        const dateFilter = {};
        if (startDate || endDate) {
            dateFilter.created_at = {};
            if (startDate) dateFilter.created_at[Op.gte] = new Date(startDate);
            if (endDate) {
                const endDateTime = new Date(endDate);
                endDateTime.setHours(23, 59, 59, 999);
                dateFilter.created_at[Op.lte] = endDateTime;
            }
        }

        // Obtener todas las órdenes en el rango con relaciones
        const orders = await Order.findAll({
            where: dateFilter,
            attributes: ['order_id', 'status', 'total_amount', 'payment_method_id', 'coupon_id'],
            include: [
                {
                    model: PaymentMethod,
                    as: 'paymentMethod',
                    attributes: ['payment_method_id', 'name', 'code']
                },
                {
                    model: Coupon,
                    as: 'coupon',
                    attributes: ['coupon_id', 'code', 'type', 'discount']
                }
            ]
        });

        // Calcular estadísticas básicas
        const totalOrders = orders.length;

        // Órdenes completadas = solo delivered
        const completedOrders = orders.filter(o => o.status === 'delivered');

        // Órdenes con ingresos = delivered o paid
        const paidOrders = orders.filter(o => o.status === 'delivered' || o.status === 'paid');

        const cancelledOrders = orders.filter(o => o.status === 'cancelled');
        const pendingOrders = orders.filter(o => o.status === 'pending');
        const shippedOrders = orders.filter(o => o.status === 'shipped');

        const totalRevenue = paidOrders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
        const lostRevenue = cancelledOrders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

        const cancellationRate = totalOrders > 0
            ? ((cancelledOrders.length / totalOrders) * 100).toFixed(2)
            : 0;

        const completionRate = totalOrders > 0
            ? ((completedOrders.length / totalOrders) * 100).toFixed(2)
            : 0;

        // Calcular promedio de orden basado en órdenes con ingreso (delivered o paid)
        const averageOrderValue = paidOrders.length > 0
            ? (totalRevenue / paidOrders.length).toFixed(2)
            : 0;

        // ESTADÍSTICAS DE MÉTODOS DE PAGO
        const paymentMethodsMap = {};
        paidOrders.forEach(order => {
            if (order.paymentMethod) {
                const methodId = order.paymentMethod.payment_method_id;
                if (!paymentMethodsMap[methodId]) {
                    paymentMethodsMap[methodId] = {
                        name: order.paymentMethod.name,
                        code: order.paymentMethod.code,
                        count: 0,
                        revenue: 0
                    };
                }
                paymentMethodsMap[methodId].count += 1;
                paymentMethodsMap[methodId].revenue += parseFloat(order.total_amount);
            }
        });

        // Encontrar método de pago más popular
        const paymentMethodsArray = Object.entries(paymentMethodsMap).map(([id, data]) => ({
            id: parseInt(id),
            ...data,
            revenue: parseFloat(data.revenue.toFixed(2))
        }));
        const mostUsedPaymentMethod = paymentMethodsArray.sort((a, b) => b.count - a.count)[0] || null;

        // ESTADÍSTICAS DE CUPONES
        const ordersWithCoupons = orders.filter(o => o.coupon_id !== null);
        let totalDiscountAmount = 0;

        ordersWithCoupons.forEach(order => {
            if (order.coupon) {
                const orderAmount = parseFloat(order.total_amount) || 0;
                let discountAmount = 0;

                if (order.coupon.type === 'percent') {
                    const discountPercent = parseFloat(order.coupon.discount) || 0;
                    // Calcular descuento aplicado
                    if (discountPercent < 100) {
                        discountAmount = (orderAmount * discountPercent) / (100 - discountPercent);
                    }
                } else {
                    discountAmount = parseFloat(order.coupon.discount) || 0;
                }

                totalDiscountAmount += discountAmount;
            }
        });

        res.json({
            success: true,
            data: {
                // Estadísticas básicas
                totalOrders,
                completedOrders: completedOrders.length,
                cancelledOrders: cancelledOrders.length,
                pendingOrders: pendingOrders.length,
                shippedOrders: shippedOrders.length,
                totalRevenue: parseFloat(totalRevenue.toFixed(2)),
                lostRevenue: parseFloat(lostRevenue.toFixed(2)),
                cancellationRate: parseFloat(cancellationRate),
                completionRate: parseFloat(completionRate),
                averageOrderValue: parseFloat(averageOrderValue),

                // Estadísticas de métodos de pago
                paymentMethods: {
                    mostUsed: mostUsedPaymentMethod,
                    breakdown: paymentMethodsArray
                },

                // Estadísticas de cupones
                coupons: {
                    ordersWithCoupons: ordersWithCoupons.length,
                    totalDiscountAmount: parseFloat((totalDiscountAmount || 0).toFixed(2)),
                    percentageOrdersWithCoupons: totalOrders > 0
                        ? parseFloat(((ordersWithCoupons.length / totalOrders) * 100).toFixed(2))
                        : 0
                }
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/reports/sales-by-category
 * Ventas agrupadas por categoría
 * Query params: startDate, endDate (opcional)
 */
router.get('/sales-by-category', async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        // Construir filtro de fechas
        const dateFilter = {};
        if (startDate || endDate) {
            dateFilter.created_at = {};
            if (startDate) dateFilter.created_at[Op.gte] = new Date(startDate);
            if (endDate) {
                const endDateTime = new Date(endDate);
                endDateTime.setHours(23, 59, 59, 999);
                dateFilter.created_at[Op.lte] = endDateTime;
            }
        }

        // Obtener órdenes con ingresos (delivered o paid) con sus items
        const orders = await Order.findAll({
            where: {
                ...dateFilter,
                status: {
                    [Op.in]: ['delivered', 'paid']
                }
            },
            include: [{
                model: OrderItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    include: [{
                        model: Category,
                        as: 'category',
                        attributes: ['category_id', 'name']
                    }]
                }]
            }]
        });

        // Agrupar por categoría
        const categoryStats = {};

        orders.forEach(order => {
            order.items.forEach(item => {
                const category = item.product?.category;
                if (!category) return;

                const categoryName = category.name;
                const categoryId = category.category_id;

                if (!categoryStats[categoryId]) {
                    categoryStats[categoryId] = {
                        category_id: categoryId,
                        category_name: categoryName,
                        total_revenue: 0,
                        total_items_sold: 0,
                        total_orders: new Set()
                    };
                }

                categoryStats[categoryId].total_revenue += parseFloat(item.price) * parseInt(item.quantity);
                categoryStats[categoryId].total_items_sold += parseInt(item.quantity);
                categoryStats[categoryId].total_orders.add(order.order_id);
            });
        });

        // Convertir a array y ordenar por revenue
        const result = Object.values(categoryStats)
            .map(stat => ({
                category_id: stat.category_id,
                category_name: stat.category_name,
                total_revenue: parseFloat(stat.total_revenue.toFixed(2)),
                total_items_sold: stat.total_items_sold,
                total_orders: stat.total_orders.size
            }))
            .sort((a, b) => b.total_revenue - a.total_revenue);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/reports/top-products
 * Top productos más vendidos, opcionalmente filtrado por categoría
 * Query params: startDate, endDate, category_id, limit (opcional)
 */
router.get('/top-products', async (req, res, next) => {
    try {
        const { startDate, endDate, category_id, limit = 10 } = req.query;

        // Construir filtro de fechas
        const dateFilter = {};
        if (startDate || endDate) {
            dateFilter.created_at = {};
            if (startDate) dateFilter.created_at[Op.gte] = new Date(startDate);
            if (endDate) {
                const endDateTime = new Date(endDate);
                endDateTime.setHours(23, 59, 59, 999);
                dateFilter.created_at[Op.lte] = endDateTime;
            }
        }

        // Construir filtro de producto
        const productFilter = {};
        if (category_id) {
            productFilter.category_id = category_id;
        }

        // Obtener órdenes con ingresos (delivered o paid) con sus items
        const orders = await Order.findAll({
            where: {
                ...dateFilter,
                status: {
                    [Op.in]: ['delivered', 'paid']
                }
            },
            include: [{
                model: OrderItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    where: productFilter,
                    include: [{
                        model: Category,
                        as: 'category',
                        attributes: ['category_id', 'name']
                    }]
                }]
            }]
        });

        // Agrupar por producto
        const productStats = {};

        orders.forEach(order => {
            order.items.forEach(item => {
                const product = item.product;
                if (!product) return;

                const productId = product.product_id;

                if (!productStats[productId]) {
                    productStats[productId] = {
                        product_id: productId,
                        product_name: product.name,
                        category_name: product.category?.name || 'Sin categoría',
                        total_quantity_sold: 0,
                        total_revenue: 0,
                        total_orders: new Set()
                    };
                }

                productStats[productId].total_quantity_sold += parseInt(item.quantity);
                productStats[productId].total_revenue += parseFloat(item.price) * parseInt(item.quantity);
                productStats[productId].total_orders.add(order.order_id);
            });
        });

        // Convertir a array y ordenar por cantidad vendida
        const result = Object.values(productStats)
            .map(stat => ({
                product_id: stat.product_id,
                product_name: stat.product_name,
                category_name: stat.category_name,
                total_quantity_sold: stat.total_quantity_sold,
                total_revenue: parseFloat(stat.total_revenue.toFixed(2)),
                total_orders: stat.total_orders.size
            }))
            .sort((a, b) => b.total_quantity_sold - a.total_quantity_sold)
            .slice(0, parseInt(limit));

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/reports/sales-over-time
 * Ventas agrupadas por día/mes para gráficas de tendencia
 * Query params: startDate, endDate, groupBy (day|month)
 */
router.get('/sales-over-time', async (req, res, next) => {
    try {
        const { startDate, endDate, groupBy = 'day' } = req.query;

        // Construir filtro de fechas
        const dateFilter = {};
        if (startDate || endDate) {
            dateFilter.created_at = {};
            if (startDate) dateFilter.created_at[Op.gte] = new Date(startDate);
            if (endDate) {
                const endDateTime = new Date(endDate);
                endDateTime.setHours(23, 59, 59, 999);
                dateFilter.created_at[Op.lte] = endDateTime;
            }
        }

        // Obtener órdenes con ingresos (delivered o paid)
        const orders = await Order.findAll({
            where: {
                ...dateFilter,
                status: {
                    [Op.in]: ['delivered', 'paid']
                }
            },
            attributes: ['order_id', 'total_amount', 'created_at'],
            order: [['created_at', 'ASC']]
        });

        // Agrupar por fecha
        const salesByDate = {};

        orders.forEach(order => {
            const date = new Date(order.created_at);
            let key;

            if (groupBy === 'month') {
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            } else {
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            }

            if (!salesByDate[key]) {
                salesByDate[key] = {
                    date: key,
                    total_revenue: 0,
                    total_orders: 0
                };
            }

            salesByDate[key].total_revenue += parseFloat(order.total_amount);
            salesByDate[key].total_orders += 1;
        });

        // Convertir a array
        const result = Object.values(salesByDate).map(stat => ({
            date: stat.date,
            total_revenue: parseFloat(stat.total_revenue.toFixed(2)),
            total_orders: stat.total_orders
        }));

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/reports/sales-comparison
 * Comparación de ventas entre dos períodos
 * Query params: startDate, endDate, groupBy (day|month)
 */
router.get('/sales-comparison', async (req, res, next) => {
    try {
        console.log('=== Sales Comparison Request ===');
        console.log('req.query:', req.query);
        console.log('req.params:', req.params);
        console.log('req.body:', req.body);

        const { startDate, endDate, groupBy = 'day' } = req.query;

        console.log('Extracted values:', { startDate, endDate, groupBy });

        if (!startDate || !endDate) {
            console.log('Validation failed: missing startDate or endDate');
            return res.status(400).json({
                success: false,
                message: 'startDate y endDate son requeridos'
            });
        }

        const currentStart = new Date(startDate);
        const currentEnd = new Date(endDate);
        currentEnd.setHours(23, 59, 59, 999);

        // Calcular período anterior con la misma duración
        const daysDiff = Math.ceil((currentEnd - currentStart) / (1000 * 60 * 60 * 24));
        const previousStart = new Date(currentStart);
        previousStart.setDate(previousStart.getDate() - daysDiff);
        const previousEnd = new Date(currentStart);
        previousEnd.setSeconds(previousEnd.getSeconds() - 1);

        // Función para obtener ventas de un período
        const getSalesForPeriod = async (start, end) => {
            const orders = await Order.findAll({
                where: {
                    created_at: {
                        [Op.gte]: start,
                        [Op.lte]: end
                    },
                    status: {
                        [Op.in]: ['delivered', 'paid']
                    }
                },
                attributes: ['order_id', 'total_amount', 'created_at'],
                order: [['created_at', 'ASC']]
            });

            const salesByDate = {};

            orders.forEach(order => {
                const date = new Date(order.created_at);
                let key;

                if (groupBy === 'month') {
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                } else {
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                }

                if (!salesByDate[key]) {
                    salesByDate[key] = {
                        date: key,
                        total_revenue: 0,
                        total_orders: 0
                    };
                }

                salesByDate[key].total_revenue += parseFloat(order.total_amount);
                salesByDate[key].total_orders += 1;
            });

            return Object.values(salesByDate).map(stat => ({
                date: stat.date,
                total_revenue: parseFloat(stat.total_revenue.toFixed(2)),
                total_orders: stat.total_orders
            }));
        };

        const [currentPeriod, previousPeriod] = await Promise.all([
            getSalesForPeriod(currentStart, currentEnd),
            getSalesForPeriod(previousStart, previousEnd)
        ]);

        // Calcular totales
        const currentTotal = currentPeriod.reduce((sum, d) => sum + d.total_revenue, 0);
        const previousTotal = previousPeriod.reduce((sum, d) => sum + d.total_revenue, 0);
        const percentageChange = previousTotal > 0
            ? (((currentTotal - previousTotal) / previousTotal) * 100).toFixed(2)
            : 0;

        res.json({
            success: true,
            data: {
                current: currentPeriod,
                previous: previousPeriod,
                comparison: {
                    currentTotal: parseFloat(currentTotal.toFixed(2)),
                    previousTotal: parseFloat(previousTotal.toFixed(2)),
                    percentageChange: parseFloat(percentageChange),
                    trend: percentageChange > 0 ? 'up' : percentageChange < 0 ? 'down' : 'stable'
                }
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/reports/first-order-date
 * Obtener la fecha de la primera orden en el sistema
 */
router.get('/first-order-date', async (req, res, next) => {
    try {
        const firstOrder = await Order.findOne({
            order: [['created_at', 'ASC']],
            attributes: ['created_at'],
            limit: 1
        });

        if (!firstOrder) {
            // Si no hay órdenes, devolver la fecha de hoy
            return res.json({
                success: true,
                data: {
                    firstOrderDate: new Date().toISOString().split('T')[0]
                }
            });
        }

        res.json({
            success: true,
            data: {
                firstOrderDate: firstOrder.created_at.toISOString().split('T')[0]
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/reports/payment-methods-summary
 * Estadísticas por método de pago
 * Query params: startDate, endDate (opcional)
 */
router.get('/payment-methods-summary', async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        // Construir filtro de fechas
        const dateFilter = {};
        if (startDate || endDate) {
            dateFilter.created_at = {};
            if (startDate) dateFilter.created_at[Op.gte] = new Date(startDate);
            if (endDate) {
                const endDateTime = new Date(endDate);
                endDateTime.setHours(23, 59, 59, 999);
                dateFilter.created_at[Op.lte] = endDateTime;
            }
        }

        // Obtener órdenes con ingresos (delivered o paid) agrupadas por método de pago
        const orders = await Order.findAll({
            where: {
                ...dateFilter,
                status: {
                    [Op.in]: ['delivered', 'paid']
                }
            },
            attributes: ['order_id', 'total_amount', 'payment_method_id'],
            include: [{
                model: PaymentMethod,
                as: 'paymentMethod',
                attributes: ['payment_method_id', 'name', 'code', 'icon']
            }]
        });

        // Agrupar por método de pago
        const paymentStats = {};

        orders.forEach(order => {
            const paymentMethod = order.paymentMethod;
            if (!paymentMethod) return;

            const methodId = paymentMethod.payment_method_id;

            if (!paymentStats[methodId]) {
                paymentStats[methodId] = {
                    payment_method_id: methodId,
                    method_name: paymentMethod.name,
                    method_code: paymentMethod.code,
                    method_icon: paymentMethod.icon,
                    total_orders: 0,
                    total_revenue: 0
                };
            }

            paymentStats[methodId].total_orders += 1;
            paymentStats[methodId].total_revenue += parseFloat(order.total_amount);
        });

        // Convertir a array y ordenar por revenue
        const result = Object.values(paymentStats)
            .map(stat => ({
                payment_method_id: stat.payment_method_id,
                method_name: stat.method_name,
                method_code: stat.method_code,
                method_icon: stat.method_icon,
                total_orders: stat.total_orders,
                total_revenue: parseFloat(stat.total_revenue.toFixed(2)),
                percentage: 0 // Se calculará después
            }))
            .sort((a, b) => b.total_revenue - a.total_revenue);

        // Calcular porcentajes
        const totalRevenue = result.reduce((sum, stat) => sum + stat.total_revenue, 0);
        result.forEach(stat => {
            stat.percentage = totalRevenue > 0
                ? parseFloat(((stat.total_revenue / totalRevenue) * 100).toFixed(2))
                : 0;
        });

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/reports/coupons-summary
 * Estadísticas de cupones de descuento
 * Query params: startDate, endDate (opcional)
 */
router.get('/coupons-summary', async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        // Construir filtro de fechas
        const dateFilter = {};
        if (startDate || endDate) {
            dateFilter.created_at = {};
            if (startDate) dateFilter.created_at[Op.gte] = new Date(startDate);
            if (endDate) {
                const endDateTime = new Date(endDate);
                endDateTime.setHours(23, 59, 59, 999);
                dateFilter.created_at[Op.lte] = endDateTime;
            }
        }

        // Obtener todas las órdenes con cupones
        const ordersWithCoupons = await Order.findAll({
            where: {
                ...dateFilter,
                coupon_id: {
                    [Op.ne]: null
                }
            },
            attributes: ['order_id', 'total_amount', 'coupon_id', 'status', 'created_at'],
            include: [{
                model: Coupon,
                as: 'coupon',
                attributes: ['coupon_id', 'code', 'type', 'discount']
            }]
        });

        // Agrupar por cupón
        const couponStats = {};
        let totalDiscountAmount = 0;
        let totalUsedCoupons = 0;
        let totalOrdersWithCoupons = 0;

        ordersWithCoupons.forEach(order => {
            const coupon = order.coupon;
            if (!coupon) return;

            const couponId = coupon.coupon_id;
            const orderAmount = parseFloat(order.total_amount) || 0;

            // Calcular descuento estimado
            let discountAmount = 0;
            if (coupon.type === 'percent') {
                const discountPercent = parseFloat(coupon.discount) || 0;
                if (discountPercent < 100) {
                    discountAmount = (orderAmount * discountPercent) / (100 - discountPercent);
                }
            } else {
                discountAmount = parseFloat(coupon.discount) || 0;
            }

            if (!couponStats[couponId]) {
                couponStats[couponId] = {
                    coupon_id: couponId,
                    coupon_code: coupon.code,
                    discount_type: coupon.type,
                    discount_value: coupon.discount,
                    times_used: 0,
                    total_discount_amount: 0,
                    orders: []
                };
            }

            couponStats[couponId].times_used += 1;
            couponStats[couponId].total_discount_amount += discountAmount;
            couponStats[couponId].orders.push({
                order_id: order.order_id,
                status: order.status,
                date: order.created_at
            });

            totalDiscountAmount += discountAmount;
            totalUsedCoupons += 1;
            totalOrdersWithCoupons += 1;
        });

        // Convertir a array y ordenar por veces usado
        const couponsArray = Object.values(couponStats)
            .map(stat => ({
                coupon_id: stat.coupon_id,
                coupon_code: stat.coupon_code,
                discount_type: stat.discount_type,
                discount_value: stat.discount_value,
                times_used: stat.times_used,
                total_discount_amount: parseFloat((stat.total_discount_amount || 0).toFixed(2))
            }))
            .sort((a, b) => b.times_used - a.times_used);

        res.json({
            success: true,
            data: {
                summary: {
                    total_coupons_used: totalUsedCoupons,
                    total_orders_with_coupons: totalOrdersWithCoupons,
                    total_discount_amount: parseFloat((totalDiscountAmount || 0).toFixed(2)),
                    unique_coupons_count: couponsArray.length
                },
                coupons: couponsArray
            }
        });
    } catch (error) {
        next(error);
    }
});

export default router;
