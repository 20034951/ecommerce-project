import { Resend } from 'resend';

class EmailService {
    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
        // Para desarrollo, usar el dominio verificado de Resend
        this.fromEmail = 'onboarding@resend.dev';
        this.isDevelopment = process.env.NODE_ENV === 'development';
    }

    async sendPasswordResetEmail(to, resetToken, userName) {
        try {
            // En desarrollo, solo loggar en lugar de enviar realmente
            if (this.isDevelopment) {
                console.log('📧 [DEV MODE] Password Reset Email:');
                console.log(`   To: ${to}`);
                console.log(`   Token: ${resetToken}`);
                console.log(`   Reset URL: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`);
                console.log(`   User: ${userName || 'Usuario'}`);
            }

            const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
            
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Recuperación de Contraseña</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; background-color: #f9f9f9; }
                        .button { 
                            display: inline-block; 
                            padding: 12px 24px; 
                            background-color: #007bff; 
                            color: white; 
                            text-decoration: none; 
                            border-radius: 5px; 
                            margin: 20px 0;
                        }
                        .footer { font-size: 12px; color: #666; margin-top: 20px; }
                        .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; margin: 15px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Recuperación de Contraseña</h1>
                        </div>
                        <div class="content">
                            <h2>Hola ${userName || 'Usuario'},</h2>
                            <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
                            <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
                            
                            <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
                            
                            <div class="warning">
                                <strong>⚠️ Importante:</strong>
                                <ul>
                                    <li>Este enlace es válido por <strong>15 minutos</strong></li>
                                    <li>Solo puede ser usado una vez</li>
                                    <li>Si no solicitaste este cambio, ignora este correo</li>
                                </ul>
                            </div>
                            
                            <p>Si el botón no funciona, puedes copiar y pegar el siguiente enlace en tu navegador:</p>
                            <p style="word-break: break-all; background-color: #e9ecef; padding: 10px; border-radius: 3px;">
                                ${resetUrl}
                            </p>
                        </div>
                        <div class="footer">
                            <p>Si tienes problemas, contacta con nuestro equipo de soporte.</p>
                            <p>Este es un correo automático, no respondas a este mensaje.</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

            const textContent = `
                Recuperación de Contraseña

                Hola ${userName || 'Usuario'},

                Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.

                Para crear una nueva contraseña, visita el siguiente enlace:
                ${resetUrl}

                IMPORTANTE:
                - Este enlace es válido por 15 minutos
                - Solo puede ser usado una vez
                - Si no solicitaste este cambio, ignora este correo

                Si tienes problemas, contacta con nuestro equipo de soporte.
            `;

            const { data, error } = await this.resend.emails.send({
                from: this.fromEmail,
                to: [to, "delivered@resend.dev"],
                subject: 'Recuperación de Contraseña - E-commerce',
                html: htmlContent,
                text: textContent,
                tags: [
                    {
                        name: 'category',
                        value: 'password_reset'
                    }
                ]
            });

            if (error) {
                throw new Error(`Error sending email: ${error.message}`);
            }

            return { success: true, messageId: data.id };
        } catch (error) {
            console.error('Email service error:', error);
            throw error;
        }
    }

    async sendPasswordChangedConfirmation(to, userName) {
        try {
            // En desarrollo, solo loggar en lugar de enviar realmente
            if (this.isDevelopment) {
                console.log('📧 [DEV MODE] Password Changed Confirmation Email:');
                console.log(`   To: ${to}`);
                console.log(`   User: ${userName || 'Usuario'}`);
                console.log(`   Message: Contraseña cambiada exitosamente`);
            }

            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Contraseña Cambiada</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; background-color: #f9f9f9; }
                        .footer { font-size: 12px; color: #666; margin-top: 20px; }
                        .success { background-color: #d4edda; border: 1px solid #c3e6cb; padding: 10px; border-radius: 5px; margin: 15px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✅ Contraseña Actualizada</h1>
                        </div>
                        <div class="content">
                            <h2>Hola ${userName || 'Usuario'},</h2>
                            <div class="success">
                                <p><strong>Tu contraseña ha sido cambiada exitosamente.</strong></p>
                            </div>
                            <p>La contraseña de tu cuenta fue actualizada el ${new Date().toLocaleString('es-ES')}.</p>
                            <p>Si no realizaste este cambio, contacta inmediatamente con nuestro equipo de soporte.</p>
                        </div>
                        <div class="footer">
                            <p>Este es un correo automático, no respondas a este mensaje.</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

            const textContent = `
                Contraseña Actualizada

                Hola ${userName || 'Usuario'},

                Tu contraseña ha sido cambiada exitosamente el ${new Date().toLocaleString('es-ES')}.

                Si no realizaste este cambio, contacta inmediatamente con nuestro equipo de soporte.
            `;

            const { data, error } = await this.resend.emails.send({
                from: this.fromEmail,
                to: [to, "delivered@resend.dev"],
                subject: 'Contraseña Actualizada - E-commerce',
                html: htmlContent,
                text: textContent,
                tags: [
                    {
                        name: 'category',
                        value: 'password_changed'
                    }
                ]
            });

            if (error) {
                throw new Error(`Error sending email: ${error.message}`);
            }

            return { success: true, messageId: data.id };
        } catch (error) {
            console.error('Email service error:', error);
            throw error;
        }
    }
}

export default new EmailService();