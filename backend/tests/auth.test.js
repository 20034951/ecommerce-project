import request from 'supertest';
import app from '../src/app.js';
import db from '../src/models/index.js';

describe('Auth API', () => {
    let email;
    let password;
    let cookie;

    beforeAll(async () => {
        email = 'testuser@testexample.com';
        password = 'p4ZZw0rd25';

        await db.Role.bulkCreate([
            { name: 'Admin', description: 'Administrator' },
            { name: 'Customer', description: 'Regular user' }
        ]);

        const roles = await db.Role.findAll();
        const roleIds = roles.map(role => role.id);

        await db.User.create({
            name: 'Test User',
            username: 'testuser',
            email: email,
            password: password,
            roles: roleIds
        });
    });

    afterAll(async () => {
        await db.User.destroy({ where: {} });
        await db.Role.destroy({ where: {} });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully with valid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    usernameOrEmail: email,
                    password: password
                })
                .expect(200);

            expect(res.body).toHaveProperty('accessToken');
            expect(res.headers['set-cookie']).toBeDefined();

            //cookie = res.headers['set-cookie'];
            cookie = res.headers['set-cookie'][0].split(';')[0];
        });

        it('should allow login with username instead of email', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    usernameOrEmail: 'testuser',
                    password: password
                })
                .expect(200);

            expect(res.body).toHaveProperty('accessToken');
        });

        it('should reject login with invalid password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    usernameOrEmail: email,
                    password: 'wrongPassword'
                })
                .expect(401);

            expect(res.body.error).toMatch(/invalid/i);
        });

        it('should reject login with nonexistent user', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    usernameOrEmail: 'noone@test.com',
                    password: 'somePass123'
                })
                .expect(401);

            expect(res.body.error).toMatch(/invalid/i);
        });

        it('should return 400 if credentials are missing', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({})
                .expect(400);

            expect(res.body.error).toMatch(/missing/i);
        });
    });

    describe('POST /api/auth/refresh', () => {
        it('should issue a new access token with valid refresh token', async () => {
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    usernameOrEmail: email,
                    password: password
                })
                .expect(200);

            const cookieString = loginRes.headers['set-cookie'][0].split(';')[0];
            
            const res = await request(app)
                .post('/api/auth/refresh')
                .set('Cookie', cookieString)
                .expect(200);

            expect(res.body).toHaveProperty('accessToken');
            expect(res.headers['set-cookie']).toBeDefined();

            cookie = res.headers['set-cookie'][0].split(';')[0];
        });

        it('should return 401 if refresh token is missing', async () => {
            const res = await request(app)
                .post('/api/auth/refresh')
                .expect(401);

            expect(res.body.error).toMatch(/missing/i);
        });

        it('should return 401 for invalid refresh token', async () => {
            const res = await request(app)
                .post('/api/auth/refresh')
                .set('Cookie', ['refreshToken=invalidToken'])
                .expect(401);

            expect(res.body.error).toMatch(/invalid/i);
        });
    });

    describe('POST /api/auth/logout', () => {
        it('should logout and clear refresh token cookie', async () => {
            const res = await request(app)
                .post('/api/auth/logout')
                .set('Cookie', cookie)
                .expect(200);

            expect(res.body.message || res.body.error).toMatch(/logged out/i);

            const newCookies = res.headers['set-cookie'] || [];
            expect(
                newCookies.some((c) => c.includes('refreshToken='))
            ).toBe(true);
        });

        it('should respond success even if no cookie is sent', async () => {
            const res = await request(app)
                .post('/api/auth/logout')
                .expect(200);

            expect(res.body.message || res.body.error).toMatch(/logged out/i);
        });
    });
});
