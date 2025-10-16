import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cacheMiddleware, invalidateCache, invalidateCacheByPrefix } from '../middleware/cache.js';
import ProductService from '../services/productService.js';
import { sendPaginatedResponse } from '../utils/sendPaginatedResponse.js';

const router = express.Router();
const CACHE_TTL = 300;

// Utility: build a deterministic cache key from query params (sorted keys)
const buildCacheKeyFromQuery = (prefix, query = {}) => {
    const keys = Object.keys(query).sort();
    const parts = keys.map(k => `${encodeURIComponent(k)}=${encodeURIComponent(String(query[k] ?? ''))}`);
    const queryString = parts.join('&');
    return `${prefix}:${queryString}`;
};

const CACHE_PREFIX_ALL = 'products:all';
const CACHE_KEY_BY_ID = (id) => `product:${id}`;

// GET all products (paginated + filters) with cache key that includes query params
router.get('/',
    cacheMiddleware((req) => buildCacheKeyFromQuery(CACHE_PREFIX_ALL, req.query), CACHE_TTL),
    asyncHandler(async (req, res) => {
        const { rows, count, paginator } = await ProductService.getAll(req.query);
        sendPaginatedResponse(res, { rows, count }, paginator);
    })
);

// GET product by ID
router.get('/:id',
    cacheMiddleware((req) => CACHE_KEY_BY_ID(req.params.id), CACHE_TTL),
    asyncHandler(async (req, res) => {
        const product = await ProductService.getById(req.params.id);
        res.status(200).json(product);
    })
);

// CREATE product
router.post('/',
  asyncHandler(async (req, res) => {
    const newProduct = await ProductService.create(req.body);
    
    await invalidateCacheByPrefix(CACHE_PREFIX_ALL);
 
    res.status(201).json(newProduct);
  })
);

// UPDATE product
router.put('/:id',
  asyncHandler(async (req, res) => {
    const updatedProduct = await ProductService.update(req.params.id, req.body);

    await invalidateCacheByPrefix(CACHE_PREFIX_ALL);
    await invalidateCache([CACHE_KEY_BY_ID(req.params.id)]);

    res.status(200).json(updatedProduct);
  })
);

// DELETE product
router.delete('/:id',
  asyncHandler(async (req, res) => {
    await ProductService.delete(req.params.id);

    await invalidateCacheByPrefix(CACHE_PREFIX_ALL);
    await invalidateCache([CACHE_KEY_BY_ID(req.params.id)]);

    res.status(200).json({ message: 'Product successfully removed' });
  })
);

export default router;
