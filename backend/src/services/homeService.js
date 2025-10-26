import db from '../models/index.js';
import { Op } from 'sequelize';

const { Product, Category, OrderItem } = db;

class HomeService {
    /**
     * Obtener productos destacados (los más vendidos)
     */
    async getFeaturedProducts(limit = 10) {
        try {
            // Obtener productos más vendidos basado en OrderItem
            const topProducts = await OrderItem.findAll({
                attributes: [
                    'product_id',
                    [db.sequelize.fn('SUM', db.sequelize.col('quantity')), 'total_sold']
                ],
                group: ['product_id'],
                order: [[db.sequelize.literal('total_sold'), 'DESC']],
                limit: limit,
                raw: true
            });

            const productIds = topProducts.map(p => p.product_id);

            if (productIds.length === 0) {
                // Si no hay ventas, devolver productos aleatorios
                return await Product.findAll({
                    where: { stock: { [Op.gt]: 0 } },
                    limit: limit,
                    order: db.sequelize.random(),
                    include: [{
                        model: Category,
                        as: 'category',
                        attributes: ['category_id', 'name', 'emoji', 'color']
                    }]
                });
            }

            // Obtener detalles completos de los productos
            const products = await Product.findAll({
                where: { product_id: { [Op.in]: productIds } },
                include: [{
                    model: Category,
                    as: 'category',
                    attributes: ['category_id', 'name', 'emoji', 'color']
                }]
            });

            // Ordenar según el orden de ventas
            const productsMap = new Map(products.map(p => [p.product_id, p]));
            return productIds.map(id => productsMap.get(id)).filter(Boolean);
        } catch (error) {
            console.error('Error obteniendo productos destacados:', error);
            throw error;
        }
    }

    /**
     * Obtener productos más vendidos por categoría
     */
    async getTopProductsByCategory(categoryId, limit = 10) {
        try {
            // Obtener productos más vendidos de una categoría específica
            const topProducts = await OrderItem.findAll({
                attributes: [
                    'product_id',
                    [db.sequelize.fn('SUM', db.sequelize.col('quantity')), 'total_sold']
                ],
                include: [{
                    model: Product,
                    as: 'product',
                    where: { category_id: categoryId },
                    attributes: []
                }],
                group: ['product_id'],
                order: [[db.sequelize.literal('total_sold'), 'DESC']],
                limit: limit,
                raw: true
            });

            const productIds = topProducts.map(p => p.product_id);

            if (productIds.length === 0) {
                // Si no hay ventas en esta categoría, devolver productos aleatorios
                return await Product.findAll({
                    where: {
                        category_id: categoryId,
                        stock: { [Op.gt]: 0 }
                    },
                    limit: limit,
                    order: db.sequelize.random(),
                    include: [{
                        model: Category,
                        as: 'category',
                        attributes: ['category_id', 'name', 'emoji', 'color']
                    }]
                });
            }

            const products = await Product.findAll({
                where: { product_id: { [Op.in]: productIds } },
                include: [{
                    model: Category,
                    as: 'category',
                    attributes: ['category_id', 'name', 'emoji', 'color']
                }]
            });

            const productsMap = new Map(products.map(p => [p.product_id, p]));
            return productIds.map(id => productsMap.get(id)).filter(Boolean);
        } catch (error) {
            console.error('Error obteniendo productos por categoría:', error);
            throw error;
        }
    }

    /**
     * Obtener 2 categorías aleatorias con productos
     */
    async getRandomCategoriesWithProducts(productLimit = 10) {
        try {
            // Obtener todas las categorías que tienen productos
            const categories = await Category.findAll({
                include: [{
                    model: Product,
                    as: 'products',
                    attributes: ['product_id'],
                    required: true
                }],
                attributes: ['category_id', 'name', 'description', 'emoji', 'color']
            });

            if (categories.length === 0) {
                return [];
            }

            // Seleccionar 2 categorías aleatorias
            const shuffled = categories.sort(() => 0.5 - Math.random());
            const selectedCategories = shuffled.slice(0, 2);

            // Obtener productos más vendidos para cada categoría
            const result = await Promise.all(
                selectedCategories.map(async (category) => {
                    const products = await this.getTopProductsByCategory(
                        category.category_id,
                        productLimit
                    );
                    return {
                        category_id: category.category_id,
                        name: category.name,
                        description: category.description,
                        emoji: category.emoji,
                        color: category.color,
                        products
                    };
                })
            );

            return result;
        } catch (error) {
            console.error('Error obteniendo categorías aleatorias:', error);
            throw error;
        }
    }

    /**
     * Obtener todas las categorías para el slider
     */
    async getAllCategories() {
        try {
            const categories = await Category.findAll({
                attributes: ['category_id', 'name', 'description', 'emoji', 'color'],
                include: [{
                    model: Product,
                    as: 'products',
                    attributes: ['product_id']
                }]
            });

            // Agregar conteo de productos
            return categories.map(cat => ({
                category_id: cat.category_id,
                name: cat.name,
                description: cat.description,
                emoji: cat.emoji,
                color: cat.color,
                product_count: cat.products?.length || 0
            }));
        } catch (error) {
            console.error('Error obteniendo categorías:', error);
            throw error;
        }
    }

    /**
     * Obtener datos completos para la página de inicio
     */
    async getHomeData() {
        try {
            const [categories, featuredProducts, categoryProducts] = await Promise.all([
                this.getAllCategories(),
                this.getFeaturedProducts(10),
                this.getRandomCategoriesWithProducts(10)
            ]);

            return {
                categories,
                featuredProducts,
                categoryProducts
            };
        } catch (error) {
            console.error('Error obteniendo datos del home:', error);
            throw error;
        }
    }
}

export default new HomeService();
