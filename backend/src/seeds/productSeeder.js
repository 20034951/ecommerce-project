/**
 * Seeder de productos (Idempotente)
 * Crea productos de prueba en diferentes categorías
 * Puede ejecutarse múltiples veces agregando más productos
 */

import { faker } from '@faker-js/faker';
import db from '../models/index.js';

const { Product, Category } = db;

// Templates de productos por categoría
const productTemplates = {
    'Electrónica': [
        { name: 'Laptop Gaming', priceRange: [800, 2000], stock: [5, 20] },
        { name: 'Smartphone', priceRange: [300, 1200], stock: [10, 50] },
        { name: 'Tablet', priceRange: [200, 800], stock: [15, 40] },
        { name: 'Auriculares Bluetooth', priceRange: [30, 300], stock: [20, 100] },
        { name: 'Smart Watch', priceRange: [150, 500], stock: [10, 30] },
        { name: 'Cámara Digital', priceRange: [400, 1500], stock: [5, 15] },
        { name: 'Consola de Videojuegos', priceRange: [300, 500], stock: [8, 25] },
        { name: 'Monitor 4K', priceRange: [250, 800], stock: [10, 30] },
    ],
    'Ropa': [
        { name: 'Camiseta', priceRange: [15, 50], stock: [50, 200] },
        { name: 'Jeans', priceRange: [40, 120], stock: [30, 100] },
        { name: 'Chaqueta', priceRange: [60, 200], stock: [20, 60] },
        { name: 'Zapatos Deportivos', priceRange: [50, 150], stock: [25, 80] },
        { name: 'Vestido', priceRange: [30, 150], stock: [20, 70] },
        { name: 'Suéter', priceRange: [35, 100], stock: [30, 90] },
    ],
    'Hogar': [
        { name: 'Sofá', priceRange: [400, 1500], stock: [5, 15] },
        { name: 'Mesa de Comedor', priceRange: [200, 800], stock: [8, 20] },
        { name: 'Lámpara LED', priceRange: [25, 150], stock: [30, 100] },
        { name: 'Juego de Sábanas', priceRange: [30, 100], stock: [40, 120] },
        { name: 'Cafetera', priceRange: [50, 300], stock: [15, 50] },
        { name: 'Aspiradora', priceRange: [100, 400], stock: [10, 30] },
    ],
    'Deportes': [
        { name: 'Bicicleta', priceRange: [200, 1000], stock: [5, 20] },
        { name: 'Pesas', priceRange: [30, 200], stock: [20, 60] },
        { name: 'Pelota de Fútbol', priceRange: [15, 50], stock: [30, 100] },
        { name: 'Raqueta de Tenis', priceRange: [50, 250], stock: [15, 40] },
        { name: 'Yoga Mat', priceRange: [20, 80], stock: [25, 80] },
    ],
    'Libros': [
        { name: 'Novela de Ficción', priceRange: [10, 30], stock: [50, 200] },
        { name: 'Libro de Cocina', priceRange: [15, 40], stock: [30, 100] },
        { name: 'Libro de Programación', priceRange: [40, 80], stock: [20, 60] },
        { name: 'Comic', priceRange: [8, 25], stock: [40, 150] },
    ],
    'Juguetes': [
        { name: 'Lego Set', priceRange: [30, 200], stock: [20, 80] },
        { name: 'Muñeca', priceRange: [15, 60], stock: [30, 100] },
        { name: 'Carro de Control Remoto', priceRange: [40, 150], stock: [15, 50] },
        { name: 'Puzzle', priceRange: [10, 40], stock: [40, 120] },
    ],
    'Belleza': [
        { name: 'Crema Facial', priceRange: [20, 80], stock: [30, 100] },
        { name: 'Shampoo Premium', priceRange: [15, 50], stock: [40, 150] },
        { name: 'Perfume', priceRange: [50, 200], stock: [20, 60] },
        { name: 'Set de Maquillaje', priceRange: [30, 120], stock: [25, 80] },
    ],
    'Alimentos': [
        { name: 'Café Premium', priceRange: [15, 40], stock: [50, 200] },
        { name: 'Chocolate Gourmet', priceRange: [5, 25], stock: [60, 250] },
        { name: 'Aceite de Oliva', priceRange: [10, 35], stock: [40, 150] },
        { name: 'Set de Especias', priceRange: [20, 60], stock: [30, 100] },
    ]
};

export const seedProducts = async (categories) => {
    const products = [];
    let created = 0;
    let skipped = 0;

    // Si no se pasan categorías, obtenerlas de la BD
    if (!categories || categories.length === 0) {
        categories = await Category.findAll();
    }

    for (const category of categories) {
        const templates = productTemplates[category.name] || [];
        
        for (const template of templates) {
            // Verificar si el producto ya existe (por nombre y categoría)
            const existing = await Product.findOne({
                where: {
                    name: template.name,
                    category_id: category.category_id
                }
            });

            if (existing) {
                products.push(existing);
                skipped++;
                continue;
            }

            const price = faker.number.float({
                min: template.priceRange[0],
                max: template.priceRange[1],
                precision: 0.01
            });

            const stock = faker.number.int({
                min: template.stock[0],
                max: template.stock[1]
            });

            const product = await Product.create({
                category_id: category.category_id,
                name: template.name,
                description: faker.commerce.productDescription(),
                price: price,
                stock: stock,
                sku: faker.string.alphanumeric(8).toUpperCase(),
                image_path: faker.image.url()
            });

            products.push(product);
            created++;
        }
    }

    // Agregar productos adicionales aleatorios (solo nuevos)
    const additionalCount = 10;
    console.log(`   🎲 Generando ${additionalCount} productos adicionales...`);
    
    for (let i = 0; i < additionalCount; i++) {
        const randomCategory = faker.helpers.arrayElement(categories);
        const productName = `${faker.commerce.productAdjective()} ${faker.commerce.product()}`;
        
        // Verificar que no exista
        const existing = await Product.findOne({
            where: { name: productName }
        });

        if (!existing) {
            const product = await Product.create({
                category_id: randomCategory.category_id,
                name: productName,
                description: faker.commerce.productDescription(),
                price: faker.number.float({ min: 10, max: 1000, precision: 0.01 }),
                stock: faker.number.int({ min: 0, max: 100 }),
                sku: faker.string.alphanumeric(8).toUpperCase(),
                image_path: faker.image.url()
            });
            products.push(product);
            created++;
        }
    }

    console.log(`   ✨ ${created} productos creados, ${skipped} ya existían`);

    return products;
};
