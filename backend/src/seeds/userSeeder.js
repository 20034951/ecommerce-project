/**
 * Seeder de usuarios (Idempotente)
 * Crea usuarios de prueba incluyendo admin y clientes
 * Puede ejecutarse múltiples veces sin duplicar datos
 */

import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import db from '../models/index.js';

const { User, UserAddress } = db;

export const seedUsers = async () => {
    const users = [];

    // Contraseñas predefinidas
    const adminPassword = await bcrypt.hash('admin123', 10);
    const editorPassword = await bcrypt.hash('editor123', 10);
    const customerPassword = await bcrypt.hash('cliente123', 10);

    // 1. Usuario Admin (FIJO - no duplicar)
    const [admin, adminCreated] = await User.findOrCreate({
        where: { email: 'admin@ecommerce.com' },
        defaults: {
            name: 'Admin Principal',
            email: 'admin@ecommerce.com',
            password_hash: adminPassword,
            phone: '+1234567890',
            role: 'admin',
            isActive: true
        }
    });
    users.push(admin);
    
    if (adminCreated) {
        console.log('   ✨ Usuario Admin creado');
    } else {
        console.log('   ♻️  Usuario Admin ya existe');
    }

    // Dirección del admin (solo si no existe)
    const existingAdminAddress = await UserAddress.findOne({
        where: { user_id: admin.user_id }
    });

    if (!existingAdminAddress) {
        await UserAddress.create({
            user_id: admin.user_id,
            address_line: '123 Admin Street, Suite 100',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            type: 'shipping'
        });
    }

    // 2. Usuario Editor (FIJO - no duplicar)
    const [editor, editorCreated] = await User.findOrCreate({
        where: { email: 'editor@ecommerce.com' },
        defaults: {
            name: 'Editor Principal',
            email: 'editor@ecommerce.com',
            password_hash: editorPassword,
            phone: '+1234567891',
            role: 'customer',
            isActive: true
        }
    });
    users.push(editor);

    if (editorCreated) {
        console.log('   ✨ Usuario Editor creado');
    } else {
        console.log('   ♻️  Usuario Editor ya existe');
    }

    // Dirección del editor (solo si no existe)
    const existingEditorAddress = await UserAddress.findOne({
        where: { user_id: editor.user_id }
    });

    if (!existingEditorAddress) {
        await UserAddress.create({
            user_id: editor.user_id,
            address_line: '456 Editor Boulevard',
            city: 'San Francisco',
            state: 'CA',
            country: 'USA',
            type: 'shipping'
        });
    }

    // 3. Usuario de Prueba Cliente (FIJO - no duplicar)
    const [testUser, testCreated] = await User.findOrCreate({
        where: { email: 'cliente@ecommerce.com' },
        defaults: {
            name: 'Cliente de Prueba',
            email: 'cliente@ecommerce.com',
            password_hash: customerPassword,
            phone: '+1555000000',
            role: 'customer',
            isActive: true
        }
    });
    users.push(testUser);

    if (testCreated) {
        console.log('   ✨ Usuario Cliente creado');
    } else {
        console.log('   ♻️  Usuario Cliente ya existe');
    }

    // Dirección del cliente (solo si no existe)
    const existingTestAddress = await UserAddress.findOne({
        where: { user_id: testUser.user_id }
    });

    if (!existingTestAddress) {
        await UserAddress.create({
            user_id: testUser.user_id,
            address_line: '789 Customer Lane',
            city: 'Los Angeles',
            state: 'CA',
            country: 'USA',
            type: 'shipping'
        });
    }

    // 4. Usuarios clientes aleatorios (FAKE - agregar más en cada ejecución)
    console.log('   🎲 Generando 10 clientes adicionales con Faker...');
    
    for (let i = 0; i < 10; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName }).toLowerCase();
        
        // Verificar si el email ya existe (evitar duplicados)
        const existingUser = await User.findOne({ where: { email } });
        
        if (!existingUser) {
            // Generar número de teléfono con formato correcto (máximo 20 caracteres)
            // Formato: +1XXXXXXXXXX (12 caracteres total)
            const phoneNumber = `+1${faker.string.numeric(10)}`;
            
            const customer = await User.create({
                name: `${firstName} ${lastName}`,
                email: email,
                password_hash: customerPassword,
                phone: phoneNumber,
                role: 'customer',
                isActive: true
            });
            users.push(customer);

            // Crear 1-3 direcciones por cliente
            const numAddresses = faker.number.int({ min: 1, max: 3 });
            
            for (let j = 0; j < numAddresses; j++) {
                const addressLine2 = faker.location.secondaryAddress();
                const addressLine = addressLine2 
                    ? `${faker.location.streetAddress()}, ${addressLine2}`
                    : faker.location.streetAddress();

                await UserAddress.create({
                    user_id: customer.user_id,
                    address_line: addressLine,
                    city: faker.location.city(),
                    state: faker.location.state({ abbreviated: true }),
                    country: 'USA',
                    type: j === 0 ? 'shipping' : faker.helpers.arrayElement(['shipping', 'billing'])
                });
            }
        }
    }

    console.log('   📧 Credenciales de acceso FIJAS:');
    console.log('   Admin:   admin@ecommerce.com / Admin123!');
    console.log('   Editor:  editor@ecommerce.com / Editor123!');
    console.log('   Cliente: cliente@ecommerce.com / Customer123!');

    return users;
};
