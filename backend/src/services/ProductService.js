import db from '../models/index.js';
import HttpError from '../utils/HttpError.js';
import Paginator from '../utils/Paginator.js';
import { Op } from 'sequelize';

const { Product, Category, OrderItem, ProductTag } = db;

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

        // Filtro de múltiples categorías
        if (query.category_id) {
            const categoryIds = query.category_id.toString().split(',').map(id => id.trim()).filter(Boolean);
            if (categoryIds.length > 0) {
                where.category_id = { [Op.in]: categoryIds };
            }
        }

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

        // Filtro dinámico de stock con operadores
        if (query.stockOperator && query.stockValue !== undefined) {
            const stockValue = parseInt(query.stockValue);
            if (!isNaN(stockValue)) {
                switch (query.stockOperator) {
                    case 'gt':
                        where.stock = { [Op.gt]: stockValue };
                        break;
                    case 'gte':
                        where.stock = { [Op.gte]: stockValue };
                        break;
                    case 'lt':
                        where.stock = { [Op.lt]: stockValue };
                        break;
                    case 'lte':
                        where.stock = { [Op.lte]: stockValue };
                        break;
                    case 'eq':
                        where.stock = { [Op.eq]: stockValue };
                        break;
                }
            }
        }

        // Configurar include para tags
        const includeOptions = [
            {
                model: Category,
                as: 'category',
                attributes: ['category_id', 'name']
            },
            {
                model: ProductTag,
                as: 'tags',
                attributes: ['tag_id', 'tag']
            }
        ];

        // Si hay búsqueda por tags, agregar filtro
        if (query.tag) {
            includeOptions[1].where = {
                tag: { [Op.like]: `%${query.tag}%` }
            };
            includeOptions[1].required = true; // INNER JOIN
        }

        const { rows, count } = await Product.findAndCountAll({
            limit,
            offset,
            order,
            where,
            include: includeOptions,
            distinct: true // Para que count sea correcto con INNER JOIN
        });

        return { rows, count, paginator: paginatorObj };
    }

    /**
     * id: req.params.id 
     * returns: Product DB Object
     */
    async getById(id) {
        const product = await Product.findByPk(id, {
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['category_id', 'name']
                },
                {
                    model: ProductTag,
                    as: 'tags',
                    attributes: ['tag_id', 'tag']
                }
            ]
        });
        if (!product) throw new HttpError(404, 'Product not found');
        return product;
    }

    async create(data) {
        const { name, description, price, stock, image_path, category_id, sku, tags } = data;

        const category = await Category.findByPk(category_id);
        if (!category) throw new HttpError(400, 'Invalid category');

        const product = await Product.create({
            name,
            description,
            price,
            stock,
            image_path,
            category_id,
            sku
        });

        // Agregar tags si fueron proporcionados
        if (tags && Array.isArray(tags) && tags.length > 0) {
            const tagRecords = tags.map(tag => ({
                product_id: product.product_id,
                tag: tag.substring(0, 50) // Limitar a 50 caracteres
            }));
            await ProductTag.bulkCreate(tagRecords);
        }

        // Recargar producto con tags
        return await Product.findByPk(product.product_id, {
            include: [
                { model: Category, as: 'category', attributes: ['category_id', 'name'] },
                { model: ProductTag, as: 'tags', attributes: ['tag_id', 'tag'] }
            ]
        });
    }

    async update(id, data) {
        const product = await Product.findByPk(id);
        if (!product) throw new HttpError(404, 'Product not found');

        const { name, description, price, stock, image_path, category_id, sku, tags } = data;

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

        // Actualizar tags si fueron proporcionados
        if (tags !== undefined) {
            // Eliminar tags existentes
            await ProductTag.destroy({ where: { product_id: id } });

            // Crear nuevos tags si hay
            if (Array.isArray(tags) && tags.length > 0) {
                const tagRecords = tags.map(tag => ({
                    product_id: id,
                    tag: tag.substring(0, 50) // Limitar a 50 caracteres
                }));
                await ProductTag.bulkCreate(tagRecords);
            }
        }

        // Recargar producto con tags
        return await Product.findByPk(id, {
            include: [
                { model: Category, as: 'category', attributes: ['category_id', 'name'] },
                { model: ProductTag, as: 'tags', attributes: ['tag_id', 'tag'] }
            ]
        });
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
