import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cacheMiddleware, invalidateCache, invalidateCacheByPrefix } from '../middleware/cache.js';
import ProductService from '../services/productService.js';
import { sendPaginatedResponse } from '../utils/sendPaginatedResponse.js';
import db from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();
const { Product, Category } = db;
const CACHE_TTL = 300; // 5 min

// 🔧 Utilidad para construir una clave de caché determinística
const buildCacheKeyFromQuery = (prefix, query = {}) => {
  const keys = Object.keys(query).sort();
  const parts = keys.map(k => `${encodeURIComponent(k)}=${encodeURIComponent(String(query[k] ?? ''))}`);
  const queryString = parts.join('&');
  return `${prefix}:${queryString}`;
};

const CACHE_PREFIX_ALL = 'products:all';
const CACHE_KEY_BY_ID = (id) => `product:${id}`;

// ✅ Buscar productos (DEBE IR ANTES de /:id para evitar conflictos)
router.get('/search', asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q || q.trim() === "") {
    return res.status(400).json({ 
      success: false,
      message: "Debe proporcionar un término de búsqueda." 
    });
  }

  console.log(`[GET] /products/search - Query: "${q}"`);
  const searchTerm = q.trim();

  // Buscar productos usando Sequelize con LIKE para búsqueda parcial
  const products = await Product.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.like]: `%${searchTerm}%` } },
        { description: { [Op.like]: `%${searchTerm}%` } },
        { sku: { [Op.like]: `%${searchTerm}%` } }
      ]
    },
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['category_id', 'name'],
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${searchTerm}%` } }
          ]
        },
        required: false // LEFT JOIN para que también traiga productos sin coincidencia en categoría
      }
    ],
    limit: 10, // Limitar resultados para mejor rendimiento
    order: [['name', 'ASC']]
  });

  res.status(200).json({ 
    success: true,
    data: products,
    count: products.length
  });
}));

// ✅ Obtener todos los productos (con paginación, filtros y caché)
router.get('/',
  cacheMiddleware((req) => buildCacheKeyFromQuery(CACHE_PREFIX_ALL, req.query), CACHE_TTL),
  asyncHandler(async (req, res) => {
    console.log(`[GET] /products - Query:`, req.query);
    const { rows, count, paginator } = await ProductService.getAll(req.query);
    sendPaginatedResponse(res, { rows, count }, paginator);
  })
);

// ✅ Obtener producto por ID
router.get('/:id',
  cacheMiddleware((req) => CACHE_KEY_BY_ID(req.params.id), CACHE_TTL),
  asyncHandler(async (req, res) => {
    console.log(`[GET] /products/${req.params.id}`);
    const product = await ProductService.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(product);
  })
);

// ✅ Crear producto
router.post('/',
  asyncHandler(async (req, res) => {
    console.log(`[POST] /products - Nuevo producto:`, req.body);
    const newProduct = await ProductService.create(req.body);

    // Invalida caché global de productos
    await invalidateCacheByPrefix(CACHE_PREFIX_ALL);

    res.status(201).json({ message: 'Producto creado exitosamente', data: newProduct });
  })
);

//  Actualizar producto
router.put('/:id',
  asyncHandler(async (req, res) => {
    console.log(`[PUT] /products/${req.params.id} - Actualización:`, req.body);
    const updatedProduct = await ProductService.update(req.params.id, req.body);

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado para actualizar' });
    }

    // Invalida caché del listado y del producto individual
    await invalidateCacheByPrefix(CACHE_PREFIX_ALL);
    await invalidateCache([CACHE_KEY_BY_ID(req.params.id)]);

    res.status(200).json({ message: 'Producto actualizado correctamente', data: updatedProduct });
  })
);

// Eliminar producto
router.delete('/:id',
  asyncHandler(async (req, res) => {
    console.log(`[DELETE] /products/${req.params.id}`);
    const deleted = await ProductService.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Producto no encontrado para eliminar' });
    }

    await invalidateCacheByPrefix(CACHE_PREFIX_ALL);
    await invalidateCache([CACHE_KEY_BY_ID(req.params.id)]);

    res.status(200).json({ message: 'Producto eliminado correctamente' });
  })
);

export default router;
