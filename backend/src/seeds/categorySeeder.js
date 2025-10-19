/**
 * Seeder de categorías (Idempotente)
 * Crea categorías de productos de prueba
 * Puede ejecutarse múltiples veces sin duplicar datos
 */

import db from '../models/index.js';

const { Category } = db;

export const seedCategories = async () => {
    const categories = [];

    const categoryData = [
        {
            name: 'Electrónica',
            description: 'Dispositivos electrónicos y accesorios tecnológicos',
            parent_id: null
        },
        {
            name: 'Ropa',
            description: 'Prendas de vestir para todas las edades',
            parent_id: null
        },
        {
            name: 'Hogar',
            description: 'Artículos para el hogar y decoración',
            parent_id: null
        },
        {
            name: 'Deportes',
            description: 'Equipamiento y ropa deportiva',
            parent_id: null
        },
        {
            name: 'Libros',
            description: 'Libros físicos y digitales',
            parent_id: null
        },
        {
            name: 'Juguetes',
            description: 'Juguetes y juegos para niños',
            parent_id: null
        },
        {
            name: 'Belleza',
            description: 'Productos de belleza y cuidado personal',
            parent_id: null
        },
        {
            name: 'Alimentos',
            description: 'Alimentos y bebidas',
            parent_id: null
        }
    ];

    let created = 0;
    let existing = 0;

    for (const catData of categoryData) {
        const [category, wasCreated] = await Category.findOrCreate({
            where: { name: catData.name },
            defaults: catData
        });
        
        categories.push(category);
        
        if (wasCreated) {
            created++;
        } else {
            existing++;
        }
    }

    console.log(`   ✨ ${created} categorías creadas, ${existing} ya existían`);

    return categories;
};
