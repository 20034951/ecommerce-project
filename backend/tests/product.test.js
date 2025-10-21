import request from 'supertest';
import app from '../src/app.js';
import db from '../src/models/index.js';

describe('Product API', () => {
    let categoryId;
    let productId;
    let productWithOrderId;
    let orderId;
    let userId;
    let addressId;

    beforeAll(async () => {
        const category = await db.Category.create({
            name: 'Books',
            description: 'Books and more books'
        });
        categoryId = category.id;

        // Crear un usuario para las órdenes
        const user = await db.User.create({
            first_name: 'Test',
            last_name: 'User',
            email: 'testuser@example.com',
            password_hash: 'hashedpassword',
            phone: '12345678'
        });
        userId = user.user_id;

        // Crear una dirección para el usuario
        const address = await db.UserAddress.create({
            user_id: userId,
            address_line_1: 'Test Street 123',
            city: 'Test City',
            state: 'Test State',
            postal_code: '12345',
            country: 'Test Country',
            is_default: true
        });
        addressId = address.address_id;
    });

    test('POST /api/products/ -> creates product', async () => {
        const res = await request(app)
            .post('/api/products/')
            .send({
                name: 'Book A',
                description: 'A test book',
                value: 19.99,
                stock: 10,
                imagePath: '/images/booka.png',
                categoryId
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        productId = res.body.id;
    });

    test('GET /api/products/ -> list products with category', async () => {
        const res = await request(app).get('/api/products/');

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('Category');
        expect(res.body[0].Category.name).toBe('Books');
    });

    test('GET /api/products/:id -> get product by ID', async () => {
        const res = await request(app).get(`/api/products/${productId}`);

        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Book A');
    });

    test('PUT /api/products/:id -> updated product', async () => {
        const res = await request(app)
            .put(`/api/products/${productId}`)
            .send( { stock: 20 });

        expect(res.status).toBe(200);
        expect(res.body.stock).toBe(20);
    });

    test('DELETE /api/products/:id -> delete product', async () => {
        const res = await request(app).delete(`/api/products/${productId}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toMatch(/Product successfully removed/i);
    });

    test('POST /api/products/ Invalid category -> 400', async () => {
        const res = await request(app)
            .post('/api/products/')
            .send({
                name: 'Book B',
                value: 15.00,
                stock: 5,
                categoryId: 999
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Invalid category');
    });

    test('DELETE /api/products/:id -> cannot delete product with orders', async () => {
        // Crear un producto asociado a una orden
        const product = await db.Product.create({
            name: 'Product with Order',
            description: 'This product has an order',
            price: 29.99,
            stock: 5,
            category_id: categoryId,
            sku: 'PROD-ORDER-001'
        });
        productWithOrderId = product.product_id;

        // Crear una orden
        const order = await db.Order.create({
            user_id: userId,
            address_id: addressId,
            total_amount: 29.99,
            status: 'pending'
        });
        orderId = order.order_id;

        // Crear un item de orden asociado al producto
        await db.OrderItem.create({
            order_id: orderId,
            product_id: productWithOrderId,
            quantity: 1,
            price: 29.99
        });

        // Intentar eliminar el producto
        const res = await request(app).delete(`/api/products/${productWithOrderId}`);

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/No se puede eliminar el producto porque está asociado a una o más órdenes/i);
    });
});