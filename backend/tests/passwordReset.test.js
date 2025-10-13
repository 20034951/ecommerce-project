import request from 'supertest';
import app from '../src/app.js';
import db from '../src/models/index.js';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

const { User, PasswordResetToken } = db;

describe('Password Reset API', () => {
    let testUser;
    let testToken;

    beforeAll(async () => {
        // Sincronizar base de datos para pruebas
        await db.sequelize.sync({ force: true });
    });

    beforeEach(async () => {
        // Crear usuario de prueba
        const hashedPassword = await bcrypt.hash('password123', 10);
        testUser = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password_hash: hashedPassword,
            role: 'customer',
            isActive: true
        });
    });

    afterEach(async () => {
        // Limpiar datos después de cada prueba
        await PasswordResetToken.destroy({ where: {} });
        await User.destroy({ where: {} });
    });

    afterAll(async () => {
        await db.sequelize.close();
    });

    describe('POST /api/auth/forgot-password', () => {
        it('should request password reset for existing user', async () => {
            const response = await request(app)
                .post('/api/auth/forgot-password')
                .send({
                    email: 'test@example.com'
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toContain('recibirás instrucciones');

            // Verificar que se creó el token en la base de datos
            const token = await PasswordResetToken.findOne({
                where: { user_id: testUser.user_id }
            });
            expect(token).toBeTruthy();
            expect(token.used).toBe(false);
        });

        it('should return success even for non-existing user (security)', async () => {
            const response = await request(app)
                .post('/api/auth/forgot-password')
                .send({
                    email: 'nonexistent@example.com'
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it('should return error if email is missing', async () => {
            const response = await request(app)
                .post('/api/auth/forgot-password')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('Email es requerido');
        });

        it('should invalidate previous tokens when requesting new one', async () => {
            // Crear primer token
            await request(app)
                .post('/api/auth/forgot-password')
                .send({ email: 'test@example.com' });

            const firstToken = await PasswordResetToken.findOne({
                where: { user_id: testUser.user_id }
            });

            // Solicitar segundo token
            await request(app)
                .post('/api/auth/forgot-password')
                .send({ email: 'test@example.com' });

            // Verificar que el primer token se marcó como usado
            await firstToken.reload();
            expect(firstToken.used).toBe(true);
        });
    });

    describe('POST /api/auth/validate-reset-token', () => {
        beforeEach(async () => {
            // Crear token válido para pruebas
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 15);
            
            const tokenRecord = await PasswordResetToken.create({
                user_id: testUser.user_id,
                token: 'valid-test-token',
                expires_at: expiresAt,
                used: false
            });
            
            testToken = tokenRecord.token;
        });

        it('should validate valid token', async () => {
            const response = await request(app)
                .post('/api/auth/validate-reset-token')
                .send({
                    token: testToken
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.valid).toBe(true);
            expect(response.body.user).toBeTruthy();
            expect(response.body.user.email).toBe('test@example.com');
        });

        it('should reject invalid token', async () => {
            const response = await request(app)
                .post('/api/auth/validate-reset-token')
                .send({
                    token: 'invalid-token'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('Token inválido o expirado');
        });

        it('should reject expired token', async () => {
            // Crear token expirado
            const expiredDate = new Date();
            expiredDate.setMinutes(expiredDate.getMinutes() - 1);
            
            await PasswordResetToken.create({
                user_id: testUser.user_id,
                token: 'expired-token',
                expires_at: expiredDate,
                used: false
            });

            const response = await request(app)
                .post('/api/auth/validate-reset-token')
                .send({
                    token: 'expired-token'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('Token inválido o expirado');
        });

        it('should reject used token', async () => {
            // Marcar token como usado
            await PasswordResetToken.update(
                { used: true, used_at: new Date() },
                { where: { token: testToken } }
            );

            const response = await request(app)
                .post('/api/auth/validate-reset-token')
                .send({
                    token: testToken
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('Token inválido o expirado');
        });

        it('should return error if token is missing', async () => {
            const response = await request(app)
                .post('/api/auth/validate-reset-token')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('Token es requerido');
        });
    });

    describe('POST /api/auth/reset-password', () => {
        beforeEach(async () => {
            // Crear token válido para pruebas
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 15);
            
            const tokenRecord = await PasswordResetToken.create({
                user_id: testUser.user_id,
                token: 'valid-reset-token',
                expires_at: expiresAt,
                used: false
            });
            
            testToken = tokenRecord.token;
        });

        it('should reset password with valid token', async () => {
            const newPassword = 'newPassword123';
            
            const response = await request(app)
                .post('/api/auth/reset-password')
                .send({
                    token: testToken,
                    newPassword,
                    confirmPassword: newPassword
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toContain('exitosamente');

            // Verificar que la contraseña cambió
            await testUser.reload();
            const isNewPassword = await bcrypt.compare(newPassword, testUser.password_hash);
            expect(isNewPassword).toBe(true);

            // Verificar que el token se marcó como usado
            const token = await PasswordResetToken.findOne({
                where: { token: testToken }
            });
            expect(token.used).toBe(true);
        });

        it('should reject mismatched passwords', async () => {
            const response = await request(app)
                .post('/api/auth/reset-password')
                .send({
                    token: testToken,
                    newPassword: 'password1',
                    confirmPassword: 'password2'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('no coinciden');
        });

        it('should reject weak password', async () => {
            const response = await request(app)
                .post('/api/auth/reset-password')
                .send({
                    token: testToken,
                    newPassword: '123',
                    confirmPassword: '123'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('al menos 6 caracteres');
        });

        it('should reject invalid token', async () => {
            const response = await request(app)
                .post('/api/auth/reset-password')
                .send({
                    token: 'invalid-token',
                    newPassword: 'newPassword123',
                    confirmPassword: 'newPassword123'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('Token inválido o expirado');
        });

        it('should reject missing fields', async () => {
            const response = await request(app)
                .post('/api/auth/reset-password')
                .send({
                    token: testToken
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('requeridos');
        });
    });

    describe('DELETE /api/auth/clean-expired-tokens', () => {
        it('should clean expired tokens', async () => {
            // Crear tokens expirados
            const expiredDate = new Date();
            expiredDate.setMinutes(expiredDate.getMinutes() - 30);
            
            await PasswordResetToken.bulkCreate([
                {
                    user_id: testUser.user_id,
                    token: 'expired-token-1',
                    expires_at: expiredDate,
                    used: false
                },
                {
                    user_id: testUser.user_id,
                    token: 'expired-token-2',
                    expires_at: expiredDate,
                    used: false
                }
            ]);

            // Crear token válido
            const validDate = new Date();
            validDate.setMinutes(validDate.getMinutes() + 15);
            await PasswordResetToken.create({
                user_id: testUser.user_id,
                token: 'valid-token',
                expires_at: validDate,
                used: false
            });

            const response = await request(app)
                .delete('/api/auth/clean-expired-tokens');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.deletedCount).toBe(2);

            // Verificar que solo queda el token válido
            const remainingTokens = await PasswordResetToken.count();
            expect(remainingTokens).toBe(1);
        });
    });
});