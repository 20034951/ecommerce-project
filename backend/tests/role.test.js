import request from 'supertest';
import app from '../src/app.js';
import db from '../src/models/index.js';

describe('Role API', () => {
    let roleId;

    beforeAll(async () => {
        await db.Role.destroy({ where: {} });
    });

    test('POST /api/roles -> creates a role', async () => {
        const res = await request(app)
            .post('/api/roles/')
            .send({
                name: 'Admin',
                description: 'Full access role'
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('Admin');
        roleId = res.body.id;
    });

    test('GET /api/roles/ -> list all roles', async () => {
        const res = await request(app).get('/api/roles/');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('name', 'Admin');
    });

    test('GET /api/roles/:id -> get role by ID', async () => {
        const res = await request(app).get(`/api/roles/${roleId}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', roleId);
        expect(res.body.name).toBe('Admin');
    });

    test('PUT /api/roles/:id -> update role', async () => {
        const res = await request(app)
            .put(`/api/roles/${roleId}`)
            .send({
                description: 'Updated description'
            });

        expect(res.status).toBe(200);
        expect(res.body.description).toBe('Updated description');
    });

    test('DELETE /api/roles/:id -> delete role', async () => {
        const res = await request(app).delete(`/api/roles/${roleId}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toMatch(/Role deleted successfully/i);
    });

    test('GET /api/roles/:id -> not found agter deletion', async () => {
        const res = await request(app).get(`/api/roles/${roleId}`);

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Role not found');
    });

    test('POST /api/roles -> duplicated role should fail', async () => {
        await request(app).post('/api/roles').send({
            name: 'User',
            description: 'Normal user'
        });
        
        const res = await request(app)
            .post('/api/roles/')
            .send({
                name: 'User',
                description: 'Duplicate'
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Role name already exists');
    });

});