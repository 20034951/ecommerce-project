import request from 'supertest';
import app from '../src/app.js'; // main express file

describe('Category API', () => {
    let categoryId;

    test('POST /api/categories/ -> creates a category', async () => {
        const res = await request(app)
                            .post('/api/categories/')
                            .send( { name: 'Electronics', description: 'Electronic Devices' });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        categoryId = res.body.id;
    });

    test('GET /api/categories/ -> get all categories', async () => {
        const res = await request(app)
                            .get('/api/categories/');
        
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].name).toBe('Electronics')
    });

    test('GET /api/categories/:id -> get category by ID', async () => {
        const res = await request(app).get(`/api/categories/${categoryId}`);

        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Electronics');
    });

    test('GET /api/categories/:id -> get category by ID (not found) 404', async () => {
        const res = await request(app).get(`/api/categories/999`);

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Category not found');
    });

    test('PUT /api/categories/:id -> updates category', async () => {
        const res = await request(app)
                            .put(`/api/categories/${categoryId}`)
                            .send({ name: 'Updated Electronics' });

        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Updated Electronics');
    });

    test('DELETE /api/categories/:id -> removes category', async () => {
        const res = await request(app).delete(`/api/categories/${categoryId}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toMatch(/Category successfully removed/i);
    });

});