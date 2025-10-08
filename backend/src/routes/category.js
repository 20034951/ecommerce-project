import express from 'express';
import db from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import HttpError from '../utils/HttpError.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';

const router = express.Router();
const { Category, Product } = db;
const CACHE_TTL = 120;

// Get all categories
router.get('/', 
    cacheMiddleware('categories:all', CACHE_TTL),
    asyncHandler(async(req, res) => {    
        const categories = await Category.findAll();
        res.json(categories);
    })
);

router.get('/with-products', 
    cacheMiddleware('categories:with-products', CACHE_TTL),
    asyncHandler(async(req, res) => {
        const categories = await Category.findAll({
            include: [{ model: Product, attributes: ['id', 'name', 'value'] }]
        });
        res.status(200).json(categories);
    })
);

// Get category by ID
router.get('/:id', 
    cacheMiddleware((req) => `category:${req.params.id}`, CACHE_TTL),
    asyncHandler(async(req, res) => {
        const category = await Category.findByPk(req.params.id);
        if (!category){
            throw new HttpError('Category not found', 404)
        }
        res.status(200).json(category);
    })
);

// Create category
router.post('/', 
    asyncHandler(async(req, res) => {
        const {name, description} = req.body;
        const newCategory = await Category.create({ name, description });

        await invalidateCache(['categories:all', 'categories:with-products']);

        res.status(201).json(newCategory);
    })
);

// Update category 
router.put('/:id', 
    asyncHandler(async(req, res) => {  
        const category = await Category.findByPk(req.params.id);
        if(!category){
            throw new HttpError('Category not found', 404);
        }

        const {name, description} = req.body;

        // Validation example
        if(name !== undefined && name.trim() === ''){
            throw new HttpError('Name cannot be empty', 400);
        }

        category.name = name ?? category.name;
        category.description = description ?? category.description;
        await category.save();

        await invalidateCache([`category:${req.params.id}`, 'categories:all', 'categories:with-products']);

        res.status(200).json(category);
    })
);

// Delete category
router.delete('/:id', 
    asyncHandler(async(req, res) => {
        const category = await Category.findByPk(req.params.id);
        if(!category){
            throw new HttpError('Category not found', 404);
        }

        await category.destroy();

        await invalidateCache([`category:${req.params.id}`, 'categories:all', 'categories:with-products']);

        res.status(200).json( { message: 'Category successfully removed' });
    })
);

export default router;