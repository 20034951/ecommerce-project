import db from './models/index.js';
import authService from './services/authService.js';

const { 
    User, 
    Category, 
    Product, 
    UserAddress, 
    ShippingMethod, 
    Coupon,
    Cart,
    CartItem,
    Notification,
    UserSession
} = db;

async function seedDatabase() {
    try {
        console.log('🌱 Iniciando inserción de datos de prueba...');

        // Crear usuarios de prueba
        console.log('👥 Creando usuarios...');
        
        const users = [
            {
                name: 'Admin Principal',
                email: 'admin@ecommerce.com',
                password_hash: await authService.hashPassword('admin123'),
                phone: '1234567890',
                role: 'admin'
            },
            {
                name: 'Editor de Contenido',
                email: 'editor@ecommerce.com',
                password_hash: await authService.hashPassword('editor123'),
                phone: '0987654321',
                role: 'editor'
            },
            {
                name: 'Juan Pérez',
                email: 'juan@cliente.com',
                password_hash: await authService.hashPassword('cliente123'),
                phone: '5556667777',
                role: 'customer'
            },
            {
                name: 'Ana García',
                email: 'ana@cliente.com',
                password_hash: await authService.hashPassword('cliente123'),
                phone: '1112223333',
                role: 'customer'
            },
            {
                name: 'Carlos Rodríguez',
                email: 'carlos@cliente.com',
                password_hash: await authService.hashPassword('cliente123'),
                phone: '4445556666',
                role: 'customer'
            }
        ];

        const createdUsers = await User.bulkCreate(users);
        console.log(`✅ ${createdUsers.length} usuarios creados`);

        // Crear direcciones
        console.log('🏠 Creando direcciones...');
        const addresses = [
            {
                user_id: createdUsers[2].user_id, // Juan
                address_line: 'Calle Principal 123',
                city: 'Guatemala',
                state: 'Guatemala',
                country: 'Guatemala',
                type: 'shipping'
            },
            {
                user_id: createdUsers[2].user_id, // Juan
                address_line: 'Avenida Las Americas 456',
                city: 'Guatemala',
                state: 'Guatemala',
                country: 'Guatemala',
                type: 'billing'
            },
            {
                user_id: createdUsers[3].user_id, // Ana
                address_line: 'Zona 10, Edificio Plaza 789',
                city: 'Guatemala',
                state: 'Guatemala',
                country: 'Guatemala',
                type: 'shipping'
            },
            {
                user_id: createdUsers[4].user_id, // Carlos
                address_line: 'Carretera a El Salvador Km 15',
                city: 'Villa Nueva',
                state: 'Guatemala',
                country: 'Guatemala',
                type: 'shipping'
            }
        ];

        await UserAddress.bulkCreate(addresses);
        console.log(`✅ ${addresses.length} direcciones creadas`);

        // Crear categorías
        console.log('📂 Creando categorías...');
        const categories = [
            {
                name: 'Electrónicos',
                description: 'Dispositivos electrónicos y tecnología'
            },
            {
                name: 'Ropa',
                description: 'Ropa y accesorios de moda'
            },
            {
                name: 'Hogar',
                description: 'Electrodomésticos y muebles para el hogar'
            },
            {
                name: 'Libros',
                description: 'Libros físicos y digitales'
            },
            {
                name: 'Deportes',
                description: 'Equipo y accesorios deportivos'
            }
        ];

        const createdCategories = await Category.bulkCreate(categories);
        console.log(`✅ ${createdCategories.length} categorías creadas`);

        // Crear productos
        console.log('📦 Creando productos...');
        const products = [
            {
                category_id: createdCategories[0].category_id,
                name: 'Smartphone X Pro',
                description: 'Último modelo con tecnología avanzada',
                price: 699.99,
                stock: 50,
                sku: 'SMX-001',
                image_path: 'https://placehold.co/600x400?text=Product\nImage'
            },
            {
                category_id: createdCategories[0].category_id,
                name: 'Laptop Gaming Pro',
                description: 'Laptop de alto rendimiento para gaming',
                price: 1299.99,
                stock: 30,
                sku: 'LTP-101',
                image_path: 'https://placehold.co/600x400?text=Product\nImage'
            },
            {
                category_id: createdCategories[0].category_id,
                name: 'Auriculares Bluetooth',
                description: 'Auriculares inalámbricos con cancelación de ruido',
                price: 199.99,
                stock: 75,
                sku: 'AUR-201',
                image_path: 'https://placehold.co/600x400?text=Product\nImage'
            },
            {
                category_id: createdCategories[1].category_id,
                name: 'Camiseta Casual',
                description: 'Camiseta de algodón 100% orgánico',
                price: 19.99,
                stock: 200,
                sku: 'CAM-500',
                image_path: 'https://placehold.co/600x400?text=Product\nImage'
            },
            {
                category_id: createdCategories[1].category_id,
                name: 'Jeans Premium',
                description: 'Pantalones jeans de corte moderno',
                price: 79.99,
                stock: 120,
                sku: 'JEA-600',
                image_path: 'https://placehold.co/600x400?text=Product\nImage'
            },
            {
                category_id: createdCategories[2].category_id,
                name: 'Aspiradora Robot',
                description: 'Aspiradora inteligente con mapeo automático',
                price: 299.99,
                stock: 40,
                sku: 'ASP-888',
                image_path: 'https://placehold.co/600x400?text=Product\nImage'
            },
            {
                category_id: createdCategories[2].category_id,
                name: 'Cafetera Express',
                description: 'Cafetera automática con molinillo integrado',
                price: 249.99,
                stock: 60,
                sku: 'CAF-777',
                image_path: 'https://placehold.co/600x400?text=Product\nImage'
            },
            {
                category_id: createdCategories[3].category_id,
                name: 'Libro: JavaScript Avanzado',
                description: 'Guía completa de JavaScript moderno',
                price: 39.99,
                stock: 100,
                sku: 'LIB-400',
                image_path: 'https://placehold.co/600x400?text=Product\nImage'
            },
            {
                category_id: createdCategories[4].category_id,
                name: 'Pelota de Fútbol Profesional',
                description: 'Pelota oficial para competencias',
                price: 29.99,
                stock: 150,
                sku: 'FUT-300',
                image_path: 'https://placehold.co/600x400?text=Product\nImage'
            },
            {
                category_id: createdCategories[4].category_id,
                name: 'Bicicleta Montaña',
                description: 'Bicicleta todo terreno 21 velocidades',
                price: 499.99,
                stock: 25,
                sku: 'BIC-900',
                image_path: 'https://placehold.co/600x400?text=Product\nImage'
            }
        ];

        const createdProducts = await Product.bulkCreate(products);
        console.log(`✅ ${createdProducts.length} productos creados`);

        // Crear métodos de envío
        console.log('🚚 Creando métodos de envío...');
        const shippingMethods = [
            {
                name: 'Envío Estándar',
                cost: 5.99,
                region: 'Guatemala'
            },
            {
                name: 'Envío Express',
                cost: 15.99,
                region: 'Guatemala'
            },
            {
                name: 'Envío Internacional',
                cost: 25.00,
                region: 'Centroamérica'
            },
            {
                name: 'Recogida en Tienda',
                cost: 0.00,
                region: 'Guatemala'
            }
        ];

        await ShippingMethod.bulkCreate(shippingMethods);
        console.log(`✅ ${shippingMethods.length} métodos de envío creados`);

        // Crear cupones
        console.log('🎫 Creando cupones...');
        const coupons = [
            {
                code: 'BIENVENIDO10',
                discount: 10,
                type: 'percent',
                valid_from: '2025-01-01',
                valid_until: '2025-12-31',
                usage_limit: 100
            },
            {
                code: 'ENVIOGRATIS',
                discount: 15.99,
                type: 'fixed',
                valid_from: '2025-01-01',
                valid_until: '2025-06-30',
                usage_limit: 50
            },
            {
                code: 'PRIMAVERA20',
                discount: 20,
                type: 'percent',
                valid_from: '2025-03-01',
                valid_until: '2025-06-30',
                usage_limit: 200
            }
        ];

        await Coupon.bulkCreate(coupons);
        console.log(`✅ ${coupons.length} cupones creados`);

        // Crear carritos y items para algunos usuarios
        console.log('🛒 Creando carritos...');
        const carts = [
            { user_id: createdUsers[2].user_id }, // Juan
            { user_id: createdUsers[3].user_id }, // Ana
            { user_id: createdUsers[4].user_id }  // Carlos
        ];

        const createdCarts = await Cart.bulkCreate(carts);

        // Agregar items a los carritos
        const cartItems = [
            {
                cart_id: createdCarts[0].cart_id,
                product_id: createdProducts[0].product_id,
                quantity: 1
            },
            {
                cart_id: createdCarts[0].cart_id,
                product_id: createdProducts[3].product_id,
                quantity: 2
            },
            {
                cart_id: createdCarts[1].cart_id,
                product_id: createdProducts[1].product_id,
                quantity: 1
            },
            {
                cart_id: createdCarts[2].cart_id,
                product_id: createdProducts[8].product_id,
                quantity: 3
            }
        ];

        await CartItem.bulkCreate(cartItems);
        console.log(`✅ ${cartItems.length} items de carrito creados`);

        // Crear notificaciones
        console.log('🔔 Creando notificaciones...');
        const notifications = [
            {
                user_id: createdUsers[2].user_id,
                message: '¡Bienvenido a nuestra tienda! Usa el código BIENVENIDO10 para obtener un 10% de descuento.',
                status: 'unread'
            },
            {
                user_id: createdUsers[3].user_id,
                message: 'Tu carrito tiene productos esperándote. ¡Completa tu compra!',
                status: 'unread'
            },
            {
                user_id: createdUsers[4].user_id,
                message: 'Nueva colección de productos deportivos disponible.',
                status: 'read'
            }
        ];

        await Notification.bulkCreate(notifications);
        console.log(`✅ ${notifications.length} notificaciones creadas`);

        // Crear sesiones de usuario de prueba
        console.log('🔐 Creando sesiones de usuario...');
        const userSessions = [
            {
                user_id: createdUsers[2].user_id, // Juan
                token_id: 'session_juan_desktop_001',
                device_info: 'Windows 10 Desktop Chrome',
                ip_address: '192.168.1.100',
                user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                is_active: true,
                expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
                last_activity: new Date(Date.now() - 10 * 60 * 1000) // hace 10 minutos
            },
            {
                user_id: createdUsers[2].user_id, // Juan
                token_id: 'session_juan_mobile_001',
                device_info: 'iPhone 15 Pro Safari Mobile',
                ip_address: '192.168.1.101',
                user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
                is_active: true,
                expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
                last_activity: new Date(Date.now() - 2 * 60 * 60 * 1000) // hace 2 horas
            },
            {
                user_id: createdUsers[3].user_id, // Ana
                token_id: 'session_ana_desktop_001',
                device_info: 'macOS Monterey Safari',
                ip_address: '192.168.1.102',
                user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
                is_active: true,
                expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
                last_activity: new Date(Date.now() - 30 * 60 * 1000) // hace 30 minutos
            },
            {
                user_id: createdUsers[3].user_id, // Ana
                token_id: 'session_ana_tablet_001',
                device_info: 'iPad Pro Safari',
                ip_address: '192.168.1.103',
                user_agent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
                is_active: true,
                expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
                last_activity: new Date(Date.now() - 4 * 60 * 60 * 1000) // hace 4 horas
            },
            {
                user_id: createdUsers[4].user_id, // Carlos
                token_id: 'session_carlos_mobile_001',
                device_info: 'Samsung Galaxy S24 Chrome Mobile',
                ip_address: '192.168.1.104',
                user_agent: 'Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
                is_active: true,
                expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
                last_activity: new Date(Date.now() - 1 * 60 * 60 * 1000) // hace 1 hora
            }
        ];

        await UserSession.bulkCreate(userSessions);
        console.log(`✅ ${userSessions.length} sesiones de usuario creadas`);

        console.log('\n🎉 ¡Base de datos poblada exitosamente!');
        console.log('\n👤 Usuarios de prueba creados:');
        console.log('📧 admin@ecommerce.com - Contraseña: admin123 (Administrador)');
        console.log('📧 editor@ecommerce.com - Contraseña: editor123 (Editor)');
        console.log('📧 juan@cliente.com - Contraseña: cliente123 (Cliente)');
        console.log('📧 ana@cliente.com - Contraseña: cliente123 (Cliente)');
        console.log('📧 carlos@cliente.com - Contraseña: cliente123 (Cliente)');
        
    } catch (error) {
        console.error('❌ Error al poblar la base de datos:', error);
        throw error;
    }
}

export default seedDatabase;