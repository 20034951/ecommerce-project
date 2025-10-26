/**
 * Seeder de usuarios (Idempotente)
 * Crea usuarios de prueba incluyendo admin y clientes
 * Puede ejecutarse múltiples veces sin duplicar datos
 */

import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import db from '../models/index.js';

const { User, UserAddress } = db;

// Departamentos de Guatemala con sus ciudades principales
const guatemalaLocations = [
    { department: 'Guatemala', cities: ['Guatemala', 'Mixco', 'Villa Nueva', 'San Miguel Petapa', 'Villa Canales'] },
    { department: 'Sacatepéquez', cities: ['Antigua Guatemala', 'Ciudad Vieja', 'San Lucas Sacatepéquez'] },
    { department: 'Escuintla', cities: ['Escuintla', 'Santa Lucía Cotzumalguapa', 'Tiquisate'] },
    { department: 'Quetzaltenango', cities: ['Quetzaltenango', 'Salcajá', 'San Mateo', 'Cantel'] },
    { department: 'Alta Verapaz', cities: ['Cobán', 'San Pedro Carchá', 'San Juan Chamelco'] },
    { department: 'Petén', cities: ['Flores', 'San Benito', 'Santa Elena'] },
    { department: 'Huehuetenango', cities: ['Huehuetenango', 'Chiantla', 'Malacatancito'] },
    { department: 'Sololá', cities: ['Sololá', 'Panajachel', 'Santiago Atitlán'] },
    { department: 'Chimaltenango', cities: ['Chimaltenango', 'San José Poaquil', 'Tecpán'] },
    { department: 'Jalapa', cities: ['Jalapa', 'San Pedro Pinula', 'Monjas'] }
];

// Zonas comunes de Guatemala (para direcciones)
const guatemalaZones = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 21];

// Función para generar dirección guatemalteca
const generateGuatemalaAddress = () => {
    const avenida = faker.number.int({ min: 1, max: 25 });
    const calle = faker.number.int({ min: 1, max: 30 });
    const numero = faker.number.int({ min: 1, max: 99 });
    const zona = faker.helpers.arrayElement(guatemalaZones);

    return `${avenida} Avenida ${calle}-${numero}, Zona ${zona}`;
};

export const seedUsers = async (count = 50) => {
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
            phone: '+50212345678',
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
            address_line: '6a Avenida 12-35, Zona 10, Oficina 100',
            city: 'Guatemala',
            state: 'Guatemala',
            country: 'Guatemala',
            postal_code: '01010',
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
            phone: '+50223456789',
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
            address_line: '15 Calle 3-40, Zona 1',
            city: 'Antigua Guatemala',
            state: 'Sacatepéquez',
            country: 'Guatemala',
            postal_code: '03001',
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
            phone: '+50234567890',
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
            address_line: '10 Avenida 25-40, Zona 14',
            city: 'Guatemala',
            state: 'Guatemala',
            country: 'Guatemala',
            postal_code: '01014',
            type: 'shipping'
        });
    }

    // 4. Usuarios clientes aleatorios (FAKE - agregar más en cada ejecución)
    console.log(`   🎲 Generando ${count} clientes adicionales con Faker...`);

    let created = 0;
    let attempts = 0;
    const maxAttempts = count * 3; // Máximo 3 veces el número deseado para evitar loops infinitos

    while (created < count && attempts < maxAttempts) {
        attempts++;

        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName }).toLowerCase();

        // Verificar si el email ya existe (evitar duplicados)
        const existingUser = await User.findOne({ where: { email } });

        if (!existingUser) {
            // Generar número de teléfono con formato correcto (máximo 20 caracteres)
            // Formato: +502XXXXXXXX (8 dígitos)
            const phoneNumber = `+502${faker.string.numeric(8)}`;

            const customer = await User.create({
                name: `${firstName} ${lastName}`,
                email: email,
                password_hash: customerPassword,
                phone: phoneNumber,
                role: 'customer',
                isActive: true
            });
            users.push(customer);
            created++;

            // Crear 1-3 direcciones por cliente
            const numAddresses = faker.number.int({ min: 1, max: 3 });

            for (let j = 0; j < numAddresses; j++) {
                // Seleccionar departamento y ciudad de Guatemala aleatoriamente
                const location = faker.helpers.arrayElement(guatemalaLocations);
                const city = faker.helpers.arrayElement(location.cities);

                // Generar código postal guatemalteco (formato: 5 dígitos)
                const postalCode = faker.string.numeric(5);

                await UserAddress.create({
                    user_id: customer.user_id,
                    address_line: generateGuatemalaAddress(),
                    city: city,
                    state: location.department,
                    country: 'Guatemala',
                    postal_code: postalCode,
                    type: j === 0 ? 'shipping' : faker.helpers.arrayElement(['shipping', 'billing'])
                });
            }
        }
    }

    console.log(`   ✅ ${created} nuevos clientes creados (${attempts} intentos)`);
    console.log('   📧 Credenciales de acceso FIJAS:');
    console.log('   Admin:   admin@ecommerce.com / admin123');
    console.log('   Editor:  editor@ecommerce.com / editor123');
    console.log('   Cliente: cliente@ecommerce.com / cliente123');

    return users;
};
