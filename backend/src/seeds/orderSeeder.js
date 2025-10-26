/**
 * Seeder de pedidos (Idempotente)
 * Crea pedidos de prueba con todos los estados posibles
 * Puede ejecutarse múltiples veces agregando más órdenes
 */

import { faker } from '@faker-js/faker';
import db from '../models/index.js';

const { Order, OrderItem, OrderStatusHistory, UserAddress, User, Product, ShippingMethod, PaymentMethod, Coupon } = db;

// Estados posibles de un pedido
const ORDER_STATUSES = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

// Empresas de transporte guatemaltecas
const guatemalanCarriers = ['FORZA', 'CARGO', 'GUATEX', 'KINGO', 'UBER'];

// Generador de número de tracking
const generateTrackingNumber = () => {
    const prefix = faker.helpers.arrayElement(guatemalanCarriers);
    const number = faker.string.numeric(10);
    return `${prefix}${number}`;
};

// Generador de URL de tracking
const generateTrackingUrl = (trackingNumber) => {
    const carriers = {
        'FORZA': 'https://rastreo.forzadelivery.com/',
        'CARGO': 'https://www.cargoexpreso.com/tracking/?guia=',
        'GUATEX': 'https://www.guatex.com/rastreo/',
        'KINGO': 'https://www.kingo.com.gt/rastreo/',
        'UBER': 'https://www.uber.com/gt/es/deliver/tracking/'
    };
    const carrier = trackingNumber.split(/[0-9]/)[0];
    const baseUrl = carriers[carrier] || carriers['FORZA'];
    return baseUrl + trackingNumber;
};

// Crear pedido con items aleatorios
const createOrderWithItems = async (userId, addressId, products, shippingMethod, status, adminId, paymentMethods, coupons) => {
    // Seleccionar 1-10 productos aleatorios
    const numItems = faker.number.int({ min: 1, max: 10 });
    const selectedProducts = faker.helpers.arrayElements(products, numItems);

    // Calcular total
    let totalAmount = 0;
    const orderItems = [];

    for (const product of selectedProducts) {
        const quantity = faker.number.int({ min: 1, max: 3 });
        const price = parseFloat(product.price);
        totalAmount += price * quantity;

        orderItems.push({
            product_id: product.product_id,
            quantity,
            price
        });
    }

    // Agregar costo de envío
    totalAmount += parseFloat(shippingMethod.cost);

    // Aplicar cupón aleatoriamente (30% de probabilidad)
    let couponId = null;
    if (coupons && coupons.length > 0 && faker.datatype.boolean({ probability: 0.3 })) {
        const coupon = faker.helpers.arrayElement(coupons);
        couponId = coupon.coupon_id;

        // Calcular descuento
        let discount = 0;
        if (coupon.type === 'percent') {
            discount = (totalAmount * coupon.discount) / 100;
        } else if (coupon.type === 'fixed') {
            discount = parseFloat(coupon.discount);
        }

        totalAmount = Math.max(0, totalAmount - discount);
    }

    // Seleccionar método de pago aleatorio
    const paymentMethod = faker.helpers.arrayElement(paymentMethods);

    // Datos del pedido según el estado
    const orderData = {
        user_id: userId,
        address_id: addressId,
        status,
        total_amount: totalAmount,
        shipping_method_id: shippingMethod.shipping_method_id,
        payment_method_id: paymentMethod.payment_method_id,
        coupon_id: couponId
    };

    // Configurar datos específicos según el estado
    const now = new Date();
    const createdAt = faker.date.between({
        from: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000), // 90 días atrás
        to: now
    });

    // Calcular días estimados de entrega según el método
    const estimatedDays = shippingMethod.name.includes('2 horas') ? 1 :
        shippingMethod.name.includes('Guatemala') ? 2 :
            shippingMethod.name.includes('Salvador') ? 3 :
                shippingMethod.name.includes('Internacional') ? 15 : 5;

    if (status === 'shipped' || status === 'delivered') {
        orderData.tracking_number = generateTrackingNumber();
        orderData.tracking_url = generateTrackingUrl(orderData.tracking_number);
        orderData.shipped_at = new Date(createdAt.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 días después de creado
        orderData.estimated_delivery = new Date(createdAt.getTime() + (2 + estimatedDays) * 24 * 60 * 60 * 1000);
    }

    if (status === 'delivered') {
        orderData.delivered_at = new Date(createdAt.getTime() + (2 + estimatedDays) * 24 * 60 * 60 * 1000);
    }

    if (status === 'cancelled') {
        const reasons = [
            'Cliente solicitó cancelación',
            'Producto sin stock',
            'Error en la dirección de envío',
            'Método de pago rechazado',
            'Cliente cambió de opinión',
            'Dirección fuera de zona de cobertura',
            'Producto dañado en bodega',
            'Pedido duplicado'
        ];
        orderData.cancellation_reason = faker.helpers.arrayElement(reasons);
        orderData.cancelled_at = new Date(createdAt.getTime() + faker.number.int({ min: 1, max: 48 }) * 60 * 60 * 1000); // 1-48 horas después
    }

    // Crear el pedido
    const order = await Order.create({
        ...orderData,
        created_at: createdAt
    });

    // Crear los items del pedido
    for (const itemData of orderItems) {
        await OrderItem.create({
            order_id: order.order_id,
            ...itemData
        });
    }

    // Crear historial de estados
    await createStatusHistory(order, status, adminId, createdAt);

    return order;
};

// Crear historial de estados
const createStatusHistory = async (order, finalStatus, adminId, orderCreatedAt) => {
    // Flujo de estados según el estado final
    const statusFlows = {
        'pending': ['pending'],
        'paid': ['pending', 'paid'],
        'processing': ['pending', 'paid', 'processing'],
        'shipped': ['pending', 'paid', 'processing', 'shipped'],
        'delivered': ['pending', 'paid', 'processing', 'shipped', 'delivered'],
        'cancelled': ['pending', 'cancelled']
    };

    const statusNotes = {
        'pending': 'Pedido creado y pendiente de pago',
        'paid': 'Pago confirmado',
        'processing': 'Pedido en preparación',
        'shipped': 'Pedido enviado al cliente',
        'delivered': 'Pedido entregado exitosamente',
        'cancelled': 'Pedido cancelado'
    };

    const flow = statusFlows[finalStatus];
    let currentDate = new Date(orderCreatedAt);

    for (let i = 0; i < flow.length; i++) {
        const status = flow[i];
        const notes = statusNotes[status];

        // El primer estado lo crea el sistema, los demás el admin
        const changedBy = i === 0 ? null : adminId;

        await OrderStatusHistory.create({
            order_id: order.order_id,
            status,
            notes,
            changed_by: changedBy,
            created_at: currentDate
        });

        // Incrementar tiempo entre estados (entre 1-24 horas)
        if (i < flow.length - 1) {
            currentDate = new Date(currentDate.getTime() + faker.number.int({ min: 1, max: 24 }) * 60 * 60 * 1000);
        }
    }
};

export const seedOrders = async (users, products, shippingMethods, ordersPerUser = 5) => {
    const orders = [];

    // Si no se pasan parámetros, obtenerlos de la BD
    if (!users || users.length === 0) {
        users = await User.findAll();
    }
    if (!products || products.length === 0) {
        products = await Product.findAll();
    }
    if (!shippingMethods || shippingMethods.length === 0) {
        shippingMethods = await ShippingMethod.findAll();
    }

    // Obtener métodos de pago
    const paymentMethods = await PaymentMethod.findAll();
    if (paymentMethods.length === 0) {
        throw new Error('No hay métodos de pago disponibles. Ejecuta primero el seeder de payment methods.');
    }

    // Obtener cupones activos
    const coupons = await Coupon.findAll({ where: { status: 'active' } });

    // Obtener admin (primer usuario o el que tenga rol admin)
    const admin = users.find(u => u.role === 'admin') || users[0];

    // Obtener clientes (todos menos el admin)
    const customers = users.filter(u => u.role === 'customer');

    console.log(`   🎲 Generando ${ordersPerUser} órdenes para cada uno de los ${customers.length} clientes...`);

    let totalCreated = 0;

    // Para cada cliente, crear N pedidos aleatorios
    for (const customer of customers) {
        // Obtener direcciones del cliente
        const addresses = await UserAddress.findAll({
            where: { user_id: customer.user_id }
        });

        if (addresses.length === 0) continue;

        // Crear exactamente N pedidos por cliente
        for (let i = 0; i < ordersPerUser; i++) {
            // Seleccionar dirección aleatoria del cliente
            const selectedAddress = faker.helpers.arrayElement(addresses);

            // Seleccionar un estado aleatorio (con distribución más realista)
            // Más pedidos entregados y en proceso, menos cancelados
            const statusWeights = [
                { status: 'delivered', weight: 40 },
                { status: 'shipped', weight: 25 },
                { status: 'processing', weight: 15 },
                { status: 'paid', weight: 10 },
                { status: 'pending', weight: 5 },
                { status: 'cancelled', weight: 5 }
            ];

            // Seleccionar estado basado en pesos
            const totalWeight = statusWeights.reduce((sum, item) => sum + item.weight, 0);
            let random = faker.number.int({ min: 1, max: totalWeight });
            let status = 'pending';

            for (const item of statusWeights) {
                if (random <= item.weight) {
                    status = item.status;
                    break;
                }
                random -= item.weight;
            }

            // Seleccionar método de envío aleatorio
            const shippingMethod = faker.helpers.arrayElement(shippingMethods);

            try {
                const order = await createOrderWithItems(
                    customer.user_id,
                    selectedAddress.address_id,
                    products,
                    shippingMethod,
                    status,
                    admin.user_id,
                    paymentMethods,
                    coupons
                );

                orders.push(order);
                totalCreated++;

                // Mostrar progreso cada 100 órdenes
                if (totalCreated % 100 === 0) {
                    console.log(`      ✅ ${totalCreated} órdenes creadas hasta ahora...`);
                }
            } catch (error) {
                console.error(`   ⚠️  Error creando pedido:`, error.message);
            }
        }
    }

    console.log(`   ✨ ${totalCreated} órdenes nuevas creadas (${ordersPerUser} por cliente)`);
    console.log(`   📊 Total de clientes procesados: ${customers.length}`);
    console.log(`   📦 Promedio de productos por orden: 5.5`);

    return orders;
};
