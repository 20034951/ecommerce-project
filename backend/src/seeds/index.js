/**
 * Seed principal para poblar la base de datos con datos de prueba (IDEMPOTENTE)
 * Puede ejecutarse múltiples veces sin duplicar datos fijos
 * Ejecutar con: npm run seed
 */

import { sequelize } from '../models/index.js';
import { seedUsers } from './userSeeder.js';
import { seedCategories } from './categorySeeder.js';
import { seedProducts } from './productSeeder.js';
import { seedShippingMethods } from './shippingMethodSeeder.js';
import { seedOrders } from './orderSeeder.js';

const runSeeders = async () => {
    try {
        console.log('🌱 Iniciando proceso de seeding IDEMPOTENTE...\n');
        console.log('ℹ️  Los datos existentes no se eliminarán\n');
        console.log('ℹ️  Los datos fijos (admin, editor, cliente) se mantienen\n');
        console.log('ℹ️  Se agregarán nuevos datos aleatorios\n');

        // Verificar conexión a la base de datos
        console.log('📊 Verificando conexión a la base de datos...');
        await sequelize.authenticate();
        console.log('✅ Conexión establecida correctamente\n');

        // Ejecutar seeders en orden (todos son idempotentes)
        console.log('👥 Seeding usuarios...');
        const users = await seedUsers();
        console.log(`✅ Proceso completado (${users.length} usuarios totales)\n`);

        console.log('📁 Seeding categorías...');
        const categories = await seedCategories();
        console.log(`✅ Proceso completado (${categories.length} categorías totales)\n`);

        console.log('📦 Seeding productos...');
        const products = await seedProducts(categories);
        console.log(`✅ Proceso completado (${products.length} productos totales)\n`);

        console.log('🚚 Seeding métodos de envío...');
        const shippingMethods = await seedShippingMethods();
        console.log(`✅ Proceso completado (${shippingMethods.length} métodos totales)\n`);

        console.log('🛒 Seeding pedidos...');
        const orders = await seedOrders(users, products, shippingMethods);
        console.log(`✅ Proceso completado (${orders.length} órdenes nuevas)\n`);

        console.log('🎉 ¡Seeding completado exitosamente!\n');
        console.log('📊 Resumen de esta ejecución:');
        console.log(`   - Usuarios procesados: ${users.length}`);
        console.log(`   - Categorías procesadas: ${categories.length}`);
        console.log(`   - Productos procesados: ${products.length}`);
        console.log(`   - Métodos de envío: ${shippingMethods.length}`);
        console.log(`   - Órdenes nuevas: ${orders.length}`);
        console.log('\n💡 Puedes ejecutar este seeder nuevamente para agregar más datos fake');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error durante el seeding:', error);
        process.exit(1);
    }
};

// Ejecutar seeders
runSeeders();
