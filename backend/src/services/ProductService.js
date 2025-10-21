import db from '../models/index.js';
import HttpError from '../utils/HttpError.js';
import Paginator from '../utils/Paginator.js';
import { Op } from 'sequelize';

const { Product, Category, OrderItem } = db;

class ProductService {
    
    /**
     * query: req.query object
     * returns: { rows, count, paginator }
     */
    async getAll(query) {
    
        const paginatorObj = new Paginator(query)
            .allowSort(['name', 'price', 'stock', 'created_at'])
            .allowFilter(['name', 'category_id', 'price', 'stock'])
            .build();

        let { limit, offset, order, where } = paginatorObj;

        // Agregar filtros especiales de stock
        if (query.lowStock === 'true' || query.lowStock === true) {
            where = {
                ...where,
                stock: { [Op.lte]: 10, [Op.gt]: 0 }
            };
        } else if (query.inStock === 'true' || query.inStock === true) {
            where = {
                ...where,
                stock: { [Op.gt]: 0 }
            };
        }

        const { rows, count } = await Product.findAndCountAll({
            limit,
            offset,
            order,
            where,
            include: [{
                model: Category,
                as: 'category',
                attributes: ['category_id', 'name']
            }]
        });

        return { rows, count, paginator: paginatorObj };
    }

    /**
     * id: req.params.id 
     * returns: Product DB Object
     */
    async getById(id) {
        const product = await Product.findByPk(id, {
            include: [{ model: Category, as: 'category', attributes: ['category_id', 'name'] }]
        });
        if (!product) throw new HttpError(404, 'Product not found');
        return product;
    }

    async create(data) {
        const { name, description, price, stock, image_path, category_id, sku } = data;

        const category = await Category.findByPk(category_id);
        if (!category) throw new HttpError(400, 'Invalid category');

        return await Product.create({
            name,
            description,
            price,
            stock,
            image_path,
            category_id,
            sku
        });
    }

    async update(id, data) {
        const product = await Product.findByPk(id);
        if (!product) throw new HttpError(404, 'Product not found');

        const { name, description, price, stock, image_path, category_id, sku } = data;

        if (category_id) {
            const category = await Category.findByPk(category_id);
            if (!category) throw new HttpError(400, 'Invalid category');
            product.category_id = category_id;
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.stock = stock ?? product.stock;
        product.image_path = image_path || product.image_path;
        product.sku = sku || product.sku;

        await product.save();
        return product;
    }

    async delete(id) {
        const product = await Product.findByPk(id);
        if (!product) throw new HttpError(404, 'Product not found');
        
        // Verificar si el producto está asociado a alguna orden
        const orderItemsCount = await OrderItem.count({
            where: { product_id: id }
        });

        if (orderItemsCount > 0) {
            throw new HttpError(400, 'No se puede eliminar el producto porque está asociado a una o más órdenes');
        }

        await product.destroy();
        return true;
    }
}

export default new ProductService();
