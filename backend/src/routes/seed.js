/**
 * Rutas para ejecutar seeders de base de datos
 * Solo disponible en modo desarrollo
 */

import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';

// Importar seeders
import { seedUsers } from '../seeds/userSeeder.js';
import { seedCategories } from '../seeds/categorySeeder.js';
import { seedProducts } from '../seeds/productSeeder.js';
import { seedShippingMethods } from '../seeds/shippingMethodSeeder.js';
import seedPaymentMethods from '../seeds/paymentMethodSeeder.js';
import { seedCoupons } from '../seeds/couponSeeder.js';
import { seedOrders } from '../seeds/orderSeeder.js';
import legacySeeder from '../seeds/legacySeeder.js';

const router = express.Router();

/**
 * @route   POST /api/seed/all
 * @desc    Ejecutar todos los seeders (usuarios, categorías, productos, pedidos)
 * @access  Solo en desarrollo
 * @body    { usersCount: number, productsPerCategory: number, ordersPerUser: number }
 */
router.post('/all', asyncHandler(async (req, res) => {
    const {
        usersCount = 50,           // Número de usuarios a crear
        productsPerCategory = 10,   // Productos por categoría
        ordersPerUser = 5           // Órdenes por usuario
    } = req.body;

    console.log('🌱 Iniciando proceso de seeding completo...');
    console.log(`📊 Parámetros: ${usersCount} usuarios, ${productsPerCategory} productos/categoría, ${ordersPerUser} órdenes/usuario\n`);

    // Ejecutar seeders en orden
    console.log('👥 Seeding usuarios...');
    const users = await seedUsers(usersCount);
    console.log(`✅ ${users.length} usuarios totales\n`);

    console.log('📁 Seeding categorías...');
    const categories = await seedCategories();
    console.log(`✅ ${categories.length} categorías totales\n`);

    console.log('📦 Seeding productos...');
    const products = await seedProducts(categories, productsPerCategory);
    console.log(`✅ ${products.length} productos totales\n`);

    console.log('🚚 Seeding métodos de envío...');
    const shippingMethods = await seedShippingMethods();
    console.log(`✅ ${shippingMethods.length} métodos de envío totales\n`);

    console.log('� Seeding métodos de pago...');
    await seedPaymentMethods();
    const db = (await import('../models/index.js')).default;
    const paymentMethodsCount = await db.PaymentMethod.count();
    console.log(`✅ ${paymentMethodsCount} métodos de pago totales\n`);

    console.log('🎟️  Seeding cupones de descuento...');
    const coupons = await seedCoupons();
    console.log(`✅ ${coupons.length} cupones totales\n`);

    console.log('�🛒 Seeding pedidos...');
    const orders = await seedOrders(users, products, shippingMethods, ordersPerUser);
    console.log(`✅ ${orders.length} pedidos totales\n`);

    res.status(200).json({
        success: true,
        message: '🎉 Base de datos poblada exitosamente',
        data: {
            users: users.length,
            categories: categories.length,
            products: products.length,
            shippingMethods: shippingMethods.length,
            paymentMethods: paymentMethodsCount,
            coupons: coupons.length,
            orders: orders.length
        }
    });
}));

/**
 * @route   POST /api/seed/users
 * @desc    Ejecutar solo el seeder de usuarios
 * @access  Solo en desarrollo
 */
router.post('/users', asyncHandler(async (req, res) => {
    console.log('👥 Seeding usuarios...');
    const users = await seedUsers();

    res.status(200).json({
        success: true,
        message: `✅ ${users.length} usuarios creados`,
        data: { count: users.length }
    });
}));

/**
 * @route   POST /api/seed/categories
 * @desc    Ejecutar solo el seeder de categorías
 * @access  Solo en desarrollo
 */
router.post('/categories', asyncHandler(async (req, res) => {
    console.log('📁 Seeding categorías...');
    const categories = await seedCategories();

    res.status(200).json({
        success: true,
        message: `✅ ${categories.length} categorías creadas`,
        data: { count: categories.length }
    });
}));

/**
 * @route   POST /api/seed/products
 * @desc    Ejecutar solo el seeder de productos
 * @access  Solo en desarrollo
 */
router.post('/products', asyncHandler(async (req, res) => {
    console.log('📦 Seeding productos...');
    const categories = await seedCategories();
    const products = await seedProducts(categories);

    res.status(200).json({
        success: true,
        message: `✅ ${products.length} productos creados`,
        data: { count: products.length }
    });
}));

/**
 * @route   POST /api/seed/payment-methods
 * @desc    Ejecutar solo el seeder de métodos de pago
 * @access  Solo en desarrollo
 */
router.post('/payment-methods', asyncHandler(async (req, res) => {
    console.log('💳 Seeding métodos de pago...');
    await seedPaymentMethods();

    const db = (await import('../models/index.js')).default;
    const count = await db.PaymentMethod.count();

    res.status(200).json({
        success: true,
        message: `✅ ${count} métodos de pago disponibles`,
        data: { count }
    });
}));

/**
 * @route   POST /api/seed/coupons
 * @desc    Ejecutar solo el seeder de cupones
 * @access  Solo en desarrollo
 */
router.post('/coupons', asyncHandler(async (req, res) => {
    console.log('🎟️  Seeding cupones...');
    const coupons = await seedCoupons();

    res.status(200).json({
        success: true,
        message: `✅ ${coupons.length} cupones creados`,
        data: { count: coupons.length }
    });
}));

/**
 * @route   POST /api/seed/orders
 * @desc    Ejecutar solo el seeder de pedidos
 * @access  Solo en desarrollo
 */
router.post('/orders', asyncHandler(async (req, res) => {
    console.log('🛒 Seeding pedidos...');

    // Necesitamos obtener usuarios, productos y métodos de envío existentes
    const db = (await import('../models/index.js')).default;
    const users = await db.User.findAll();
    const products = await db.Product.findAll();
    const shippingMethods = await db.ShippingMethod.findAll();

    if (users.length === 0 || products.length === 0 || shippingMethods.length === 0) {
        return res.status(400).json({
            success: false,
            message: '❌ Faltan datos requeridos. Ejecuta primero /api/seed/all o asegúrate de tener usuarios, productos y métodos de envío'
        });
    }

    const orders = await seedOrders(users, products, shippingMethods);

    res.status(200).json({
        success: true,
        message: `✅ ${orders.length} pedidos creados`,
        data: { count: orders.length }
    });
}));

/**
 * @route   POST /api/seed/legacy
 * @desc    Ejecutar el seeder legacy (seedDatabase.js original)
 * @access  Solo en desarrollo
 */
router.post('/legacy', asyncHandler(async (req, res) => {
    console.log('🌱 Ejecutando legacy seeder...');
    await legacySeeder();

    res.status(200).json({
        success: true,
        message: '✅ Legacy seeder ejecutado exitosamente'
    });
}));

/**
 * @route   GET /api/seed/status
 * @desc    Obtener información sobre los datos actuales en la BD
 * @access  Solo en desarrollo
 */
router.get('/status', asyncHandler(async (req, res) => {
    const db = (await import('../models/index.js')).default;

    const stats = {
        users: await db.User.count(),
        categories: await db.Category.count(),
        products: await db.Product.count(),
        orders: await db.Order.count(),
        orderItems: await db.OrderItem.count(),
        orderStatusHistory: await db.OrderStatusHistory.count(),
        shippingMethods: await db.ShippingMethod.count(),
        paymentMethods: await db.PaymentMethod.count(),
        coupons: await db.Coupon.count(),
        carts: await db.Cart.count(),
        addresses: await db.UserAddress.count()
    };

    res.status(200).json({
        success: true,
        message: '📊 Estado actual de la base de datos',
        data: stats
    });
}));

export default router;
