import request from 'supertest';
import app from '../src/app.js';
import db from '../src/models/index.js';

describe('Product API', () => {
    let categoryId;
    let productId;

    beforeAll(async () => {
        const category = await db.Category.create({
            name: 'Books',
            description: 'Books and more books'
        });
        categoryId = category.id;
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
});