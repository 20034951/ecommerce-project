/**
 * Seeder de pedidos (Idempotente)
 * Crea pedidos de prueba con todos los estados posibles
 * Puede ejecutarse múltiples veces agregando más órdenes
 */

import { faker } from '@faker-js/faker';
import db from '../models/index.js';

const { Order, OrderItem, OrderStatusHistory, UserAddress, User, Product, ShippingMethod } = db;

// Estados posibles de un pedido
const ORDER_STATUSES = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

// Generador de número de tracking
const generateTrackingNumber = () => {
    const prefix = faker.helpers.arrayElement(['UPS', 'FDX', 'DHL', 'USPS']);
    const number = faker.string.numeric(12);
    return `${prefix}${number}`;
};

// Generador de URL de tracking
const generateTrackingUrl = (trackingNumber) => {
    const carriers = {
        'UPS': 'https://www.ups.com/track?tracknum=',
        'FDX': 'https://www.fedex.com/fedextrack/?tracknumbers=',
        'DHL': 'https://www.dhl.com/track?trackingNumber=',
        'USPS': 'https://tools.usps.com/go/TrackConfirmAction?tLabels='
    };
    const carrier = trackingNumber.substring(0, 3);
    const baseUrl = carriers[carrier] || carriers['UPS'];
    return baseUrl + trackingNumber;
};

// Crear pedido con items aleatorios
const createOrderWithItems = async (userId, addressId, products, shippingMethod, status, adminId) => {
    // Seleccionar 1-5 productos aleatorios
    const numItems = faker.number.int({ min: 1, max: 5 });
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

    // Datos del pedido según el estado
    const orderData = {
        user_id: userId,
        address_id: addressId,
        status,
        total_amount: totalAmount,
        shipping_method_id: shippingMethod.shipping_method_id
    };

    // Configurar datos específicos según el estado
    const now = new Date();
    const createdAt = faker.date.between({
        from: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000), // 90 días atrás
        to: now
    });

    // Calcular días estimados de entrega según el método
    const estimatedDays = shippingMethod.name.includes('Premium') ? 1 : 
                         shippingMethod.name.includes('Express') ? 3 :
                         shippingMethod.name.includes('Internacional') ? 15 : 7;

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
            'Cliente cambió de opinión'
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

export const seedOrders = async (users, products, shippingMethods) => {
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

    // Obtener admin (primer usuario o el que tenga rol admin)
    const admin = users.find(u => u.role === 'admin') || users[0];
    
    // Obtener clientes (todos menos el admin)
    const customers = users.filter(u => u.role === 'customer');

    console.log(`   🎲 Generando órdenes para ${customers.length} clientes...`);

    // Para cada cliente, crear 2-4 nuevos pedidos
    for (const customer of customers) {
        // Obtener direcciones del cliente
        const addresses = await UserAddress.findAll({
            where: { user_id: customer.user_id }
        });

        if (addresses.length === 0) continue;

        const defaultAddress = addresses[0];

        // Crear 2-4 pedidos por cliente con diferentes estados
        const numOrders = faker.number.int({ min: 2, max: 4 });

        for (let i = 0; i < numOrders; i++) {
            // Seleccionar un estado aleatorio
            const status = faker.helpers.arrayElement(ORDER_STATUSES);
            
            // Seleccionar método de envío aleatorio
            const shippingMethod = faker.helpers.arrayElement(shippingMethods);

            try {
                const order = await createOrderWithItems(
                    customer.user_id,
                    defaultAddress.address_id,
                    products,
                    shippingMethod,
                    status,
                    admin.user_id
                );

                orders.push(order);
            } catch (error) {
                console.error(`   ⚠️  Error creando pedido:`, error.message);
            }
        }
    }

    console.log(`   ✨ ${orders.length} órdenes nuevas creadas`);

    return orders;
};
