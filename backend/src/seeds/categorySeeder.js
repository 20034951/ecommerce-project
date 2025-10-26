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
            description: 'Dispositivos electrónicos, computadoras, teléfonos y accesorios tecnológicos',
            emoji: '📱',
            color: '#3B82F6',
            parent_id: null
        },
        {
            name: 'Ropa y Calzado',
            description: 'Prendas de vestir, zapatos y accesorios de moda',
            emoji: '👕',
            color: '#EC4899',
            parent_id: null
        },
        {
            name: 'Hogar y Muebles',
            description: 'Muebles, decoración y artículos para el hogar',
            emoji: '🏠',
            color: '#10B981',
            parent_id: null
        },
        {
            name: 'Deportes y Aire Libre',
            description: 'Equipamiento deportivo, camping y actividades al aire libre',
            emoji: '⚽',
            color: '#F97316',
            parent_id: null
        },
        {
            name: 'Libros y Medios',
            description: 'Libros, películas, series y contenido digital',
            emoji: '📚',
            color: '#A855F7',
            parent_id: null
        },
        {
            name: 'Juguetes y Videojuegos',
            description: 'Juguetes, consolas y videojuegos para todas las edades',
            emoji: '🎮',
            color: '#6366F1',
            parent_id: null
        },
        {
            name: 'Belleza y Salud',
            description: 'Productos de belleza, cuidado personal y bienestar',
            emoji: '💄',
            color: '#EF4444',
            parent_id: null
        },
        {
            name: 'Alimentos y Bebidas',
            description: 'Alimentos, bebidas y productos comestibles',
            emoji: '🍔',
            color: '#14B8A6',
            parent_id: null
        },
        {
            name: 'Electrodomésticos y Cocina',
            description: 'Electrodomésticos, utensilios y equipos de cocina',
            emoji: '🍳',
            color: '#EAB308',
            parent_id: null
        },
        {
            name: 'Jardinería',
            description: 'Herramientas y productos para jardín',
            emoji: '🌱',
            color: '#84CC16',
            parent_id: null
        },
        {
            name: 'Automotriz',
            description: 'Accesorios y productos para vehículos',
            emoji: '🚗',
            color: '#6B7280',
            parent_id: null
        },
        {
            name: 'Mascotas',
            description: 'Productos para el cuidado de mascotas',
            emoji: '🐾',
            color: '#F59E0B',
            parent_id: null
        },
        {
            name: 'Oficina y Papelería',
            description: 'Suministros y equipos de oficina',
            emoji: '📎',
            color: '#64748B',
            parent_id: null
        },
        {
            name: 'Instrumentos Musicales',
            description: 'Instrumentos y accesorios musicales',
            emoji: '🎸',
            color: '#8B5CF6',
            parent_id: null
        },
        {
            name: 'Bebés y Maternidad',
            description: 'Productos para bebés y maternidad',
            emoji: '👶',
            color: '#F43F5E',
            parent_id: null
        },
        {
            name: 'Ferretería y Construcción',
            description: 'Herramientas y materiales de construcción',
            emoji: '🔨',
            color: '#78716C',
            parent_id: null
        },
        {
            name: 'Artesanías Guatemaltecas',
            description: 'Productos artesanales típicos de Guatemala',
            emoji: '🎨',
            color: '#06B6D4',
            parent_id: null
        },
        {
            name: 'Fotografía',
            description: 'Cámaras y equipo fotográfico',
            emoji: '📷',
            color: '#10B981',
            parent_id: null
        },
        {
            name: 'Joyería',
            description: 'Joyas y bisutería',
            emoji: '💎',
            color: '#D946EF',
            parent_id: null
        },
        {
            name: 'Arte y Manualidades',
            description: 'Materiales artísticos y productos para manualidades',
            emoji: '🖌️',
            color: '#0EA5E9',
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
