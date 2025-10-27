import express from 'express';
import db from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import HttpError from '../utils/HttpError.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';

const router = express.Router();
const { Category, Product } = db;
const CACHE_TTL = { admin: 5, store: 30 }; // 5 segundos para admin, 30 para store

// Get all categories
router.get('/',
    cacheMiddleware('categories:all', CACHE_TTL),
    asyncHandler(async (req, res) => {
        const categories = await Category.findAll({
            attributes: [
                'category_id',
                'name',
                'description',
                'emoji',
                'color',
                'parent_id',
                'created_at',
                'updated_at',
                [
                    db.sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM product
                        WHERE product.category_id = Category.category_id
                    )`),
                    'productCount'
                ]
            ]
        });
        res.json(categories);
    })
);

router.get('/with-products',
    cacheMiddleware('categories:with-products', CACHE_TTL),
    asyncHandler(async (req, res) => {
        const categories = await Category.findAll({
            include: [{ model: Product, attributes: ['id', 'name', 'value'] }]
        });
        res.status(200).json(categories);
    })
);

// Get category by ID
router.get('/:id',
    cacheMiddleware((req) => `category:${req.params.id}`, CACHE_TTL),
    asyncHandler(async (req, res) => {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            throw new HttpError(404, 'Category not found')
        }
        res.status(200).json(category);
    })
);

// Create category
router.post('/',
    asyncHandler(async (req, res) => {
        const { name, description, emoji, color, parent_id } = req.body;
        const newCategory = await Category.create({
            name,
            description,
            emoji,
            color,
            parent_id
        });

        await invalidateCache(['categories:all', 'categories:with-products']);

        res.status(201).json(newCategory);
    })
);

// Update category 
router.put('/:id',
    asyncHandler(async (req, res) => {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            throw new HttpError(404, 'Category not found');
        }

        const { name, description, emoji, color, parent_id } = req.body;

        // Validation example
        if (name !== undefined && name.trim() === '') {
            throw new HttpError(400, 'Name cannot be empty');
        }

        category.name = name ?? category.name;
        category.description = description ?? category.description;
        category.emoji = emoji ?? category.emoji;
        category.color = color ?? category.color;
        category.parent_id = parent_id !== undefined ? parent_id : category.parent_id;
        await category.save();

        await invalidateCache([`category:${req.params.id}`, 'categories:all', 'categories:with-products']);

        res.status(200).json(category);
    })
);

// Delete category
router.delete('/:id',
    asyncHandler(async (req, res) => {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            throw new HttpError(404, 'Category not found');
        }

        await category.destroy();

        await invalidateCache([`category:${req.params.id}`, 'categories:all', 'categories:with-products']);

        res.status(200).json({ message: 'Category successfully removed' });
    })
);

export default router;