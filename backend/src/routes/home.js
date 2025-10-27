import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cacheMiddleware } from '../middleware/cache.js';
import homeService from '../services/homeService.js';

const router = express.Router();
const CACHE_TTL = { admin: 5, store: 30 }; // 5 segundos para admin, 30 para store

/**
 * @route   GET /api/home
 * @desc    Obtener todos los datos para la página de inicio
 * @access  Public
 */
router.get(
    '/',
    cacheMiddleware('home:data', CACHE_TTL),
    asyncHandler(async (req, res) => {
        const data = await homeService.getHomeData();
        res.json(data);
    })
);

/**
 * @route   GET /api/home/categories
 * @desc    Obtener todas las categorías con conteo de productos
 * @access  Public
 */
router.get(
    '/categories',
    cacheMiddleware('home:categories', CACHE_TTL),
    asyncHandler(async (req, res) => {
        const categories = await homeService.getAllCategories();
        res.json(categories);
    })
);

/**
 * @route   GET /api/home/featured-products
 * @desc    Obtener productos más vendidos
 * @access  Public
 */
router.get(
    '/featured-products',
    cacheMiddleware((req) => `home:featured:${req.query.limit || 10}`, CACHE_TTL),
    asyncHandler(async (req, res) => {
        const limit = parseInt(req.query.limit) || 10;
        const products = await homeService.getFeaturedProducts(limit);
        res.json(products);
    })
);

/**
 * @route   GET /api/home/category-products
 * @desc    Obtener 2 categorías aleatorias con sus productos más vendidos
 * @access  Public
 */
router.get(
    '/category-products',
    cacheMiddleware((req) => `home:category-products:${req.query.limit || 10}`, CACHE_TTL),
    asyncHandler(async (req, res) => {
        const limit = parseInt(req.query.limit) || 10;
        const data = await homeService.getRandomCategoriesWithProducts(limit);
        res.json(data);
    })
);

export default router;
