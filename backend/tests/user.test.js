import request from 'supertest';
import app from '../src/app.js';
import db from '../src/models/index.js';

describe('User API', () => {

    beforeAll(async () => {
        await db.Role.bulkCreate( [
            { name: 'Admin', description: 'Administrator' },
            { name: 'Customer', description: 'Regular user' }
        ] );
    });

    test('POST /api/users/ -> creates a user with roles', async () => {
        const roles = await db.Role.findAll();
        const roleIds = roles.map(role => role.id);

        const res = await request(app)
            .post('/api/users/')
            .send({
                name: 'Pablo Pueblo',
                username: 'pablopueblo',
                email: 'pablo@pueblo.com',
                password: '123456',
                roles: roleIds
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe('Pablo Pueblo');
        expect(res.body.Roles.length).toBe(2);
    });

    test('GET /api/users -> list all users', async () => {
        const res = await request(app)
            .get('/api/users/');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('GET /api/users/:id -> get user by ID', async () => {
        const user = await db.User.findOne();
        const res = await request(app)
            .get(`/api/users/${user.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.username).toBe('pablopueblo');
    });

    test('PUT /api/users/:id -> update user roles', async () => {
        const user = await db.User.findOne();
        const role = await db.Role.findOne( { where: { name: 'Customer' } });

        const res = await request(app)
            .put(`/api/users/${user.id}`)
            .send( {roles: [role.id] });

        expect(res.statusCode).toBe(200);
        expect(res.body.Roles.length).toBe(1);
        expect(res.body.Roles[0].name).toBe('Customer');
    });

    test('DELETE /api/users/:id -> deletes an existing user', async () => {
        const user = await db.User.findOne();
        const res = await request(app)
            .delete(`/api/users/${user.id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('User deleted successfully');
    });

});