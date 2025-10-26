/**
 * Seeder de métodos de envío (Idempotente)
 * Crea diferentes opciones de envío disponibles
 * Puede ejecutarse múltiples veces sin duplicar datos
 */

import db from '../models/index.js';

const { ShippingMethod } = db;

export const seedShippingMethods = async () => {
    const shippingMethods = [];

    const methodsData = [
        {
            name: 'Municipio de Guatemala',
            cost: 15.00,
            region: 'Nacional'
        },
        {
            name: 'Carretera al Salvador',
            cost: 25.00,
            region: 'Nacional'
        },
        {
            name: 'Envío en menos de 2 horas',
            cost: 25.00,
            region: 'Nacional'
        },
        {
            name: 'Envío Internacional',
            cost: 35.00,
            region: 'Internacional'
        },
        {
            name: 'Envío Gratis',
            cost: 0.00,
            region: 'Nacional'
        }
    ];

    let created = 0;
    let existing = 0;

    for (const methodData of methodsData) {
        const [method, wasCreated] = await ShippingMethod.findOrCreate({
            where: { name: methodData.name },
            defaults: methodData
        });

        shippingMethods.push(method);

        if (wasCreated) {
            created++;
        } else {
            existing++;
        }
    }

    console.log(`   ✨ ${created} métodos de envío creados, ${existing} ya existían`);

    return shippingMethods;
};
