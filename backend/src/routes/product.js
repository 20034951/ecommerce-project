import express from 'express';
import db from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js'
import HttpError from '../utils/HttpError.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';

const router = express.Router();
const { Product, Category } = db;
const CACHE_TTL = 120;

// Get all products with category associated
router.get('/', 
    cacheMiddleware('products:all', CACHE_TTL),
    asyncHandler(async(req, res) => {
        const products = await Product.findAll({
            include: [{ model: Category, attributes:['id', 'name'] }]
        });
        res.status(200).json(products);
    })
);

// Get product by ID
router.get('/:id', 
    cacheMiddleware((req) => `product:${req.params.id}`, CACHE_TTL),
    asyncHandler(async(req, res) => {
        const product = await Product.findByPk(req.params.id, {
            include: [{ model: Category, attributes:['id', 'name'] }]
        });
        if(!product) {
            throw new HttpError('Product not found', 404);
        }
        res.status(200).json(product);
    })
);

// Create product
router.post('/', 
    asyncHandler(async(req, res) => {
        const { name, description, value, stock, imagePath, categoryId } = req.body;

        //Check if category exists
        const category = await Category.findByPk(categoryId);
        if(!category){
            throw new HttpError('Invalid category', 400);
        }

        const newProduct = await Product.create({
            name,
            description,
            value,
            stock,
            imagePath,
            categoryId
        });

        await invalidateCache(['products:all']);

        res.status(201).json(newProduct);
    })
);


// Update product
router.put('/:id', 
    asyncHandler(async(req, res) => {
        const product = await Product.findByPk(req.params.id);
        if(!product) {
            throw new HttpError('Product not found', 404);
        }
        
        const { name, description, value, stock, imagePath, categoryId } = req.body;

        //Check if category exists
        if(categoryId){
            const category = await Category.findByPk(categoryId);
            if(!category){
                throw new HttpError('Invalid category', 400);
            }
            product.categoryId = categoryId;
        }
        
        product.name = name || product.name;
        product.description = description || product.description;
        product.value = value || product.value;
        product.stock = stock ?? product.stock;
        product.imagePath = imagePath || product.imagePath;
        
        await product.save();

        await invalidateCache([`product:${req.params.id}`, 'products:all']);

        res.status(200).json(product);
    })
);

// Delete product
router.delete('/:id', 
    asyncHandler(async(req, res) => {
        const product = await Product.findByPk(req.params.id);
        if(!product){
            throw new HttpError('Product not found', 404);
        }

        await product.destroy();
        await invalidateCache([`product:${req.params.id}`, 'products:all']);

        res.status(200).json({ message: 'Product successfully removed' });
    })
);

export default router;