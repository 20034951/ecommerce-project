import { Resend } from "resend";

class EmailService {
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    // Para desarrollo, usar el dominio verificado de Resend
    this.fromEmail = "onboarding@resend.dev";
    this.isDevelopment = process.env.NODE_ENV === "development";
  }

  async sendPasswordResetEmail(to, resetToken, userName) {
    try {
      // En desarrollo, solo loggar en lugar de enviar realmente
      if (this.isDevelopment) {
        console.log("📧 [DEV MODE] Password Reset Email:");
        console.log(`   To: ${to}`);
        console.log(`   Token: ${resetToken}`);
        console.log(
          `   Reset URL: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
        );
        console.log(`   User: ${userName || "Usuario"}`);
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
                            <h2>Hola ${userName || "Usuario"},</h2>
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

                Hola ${userName || "Usuario"},

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
        subject: "Recuperación de Contraseña - E-commerce",
        html: htmlContent,
        text: textContent,
        tags: [
          {
            name: "category",
            value: "password_reset",
          },
        ],
      });

      if (error) {
        throw new Error(`Error sending email: ${error.message}`);
      }

      return { success: true, messageId: data.id };
    } catch (error) {
      console.error("Email service error:", error);
      throw error;
    }
  }

  async sendPasswordChangedConfirmation(to, userName) {
    try {
      // En desarrollo, solo loggar en lugar de enviar realmente
      if (this.isDevelopment) {
        console.log("📧 [DEV MODE] Password Changed Confirmation Email:");
        console.log(`   To: ${to}`);
        console.log(`   User: ${userName || "Usuario"}`);
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
                            <h2>Hola ${userName || "Usuario"},</h2>
                            <div class="success">
                                <p><strong>Tu contraseña ha sido cambiada exitosamente.</strong></p>
                            </div>
                            <p>La contraseña de tu cuenta fue actualizada el ${new Date().toLocaleString(
                              "es-ES"
                            )}.</p>
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

                Hola ${userName || "Usuario"},

                Tu contraseña ha sido cambiada exitosamente el ${new Date().toLocaleString(
                  "es-ES"
                )}.

                Si no realizaste este cambio, contacta inmediatamente con nuestro equipo de soporte.
            `;

      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: [to, "delivered@resend.dev"],
        subject: "Contraseña Actualizada - E-commerce",
        html: htmlContent,
        text: textContent,
        tags: [
          {
            name: "category",
            value: "password_changed",
          },
        ],
      });

      if (error) {
        throw new Error(`Error sending email: ${error.message}`);
      }

      return { success: true, messageId: data.id };
    } catch (error) {
      console.error("Email service error:", error);
      throw error;
    }
  }

  async sendOrderConfirmation(order) {
    try {
      const { user, order_id, total_amount, items, created_at, orderNumber } = order;

      if (this.isDevelopment) {
        console.log("📧 [DEV MODE] Order Confirmation Email:");
        console.log(`   To: ${user.email}`);
        console.log(`   Order Number: ${orderNumber || order_id}`);
        console.log(`   Total: Q ${total_amount}`);
      }

      // Calcular subtotal (sin envío)
      const subtotal = items.reduce((sum, item) => {
        return sum + (parseFloat(item.price) * item.quantity);
      }, 0);

      // Formatear moneda en Quetzales
      const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-GT', {
          style: 'currency',
          currency: 'GTQ',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount);
      };

      const itemsList = items
        .map(
          (item) => `
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #ddd;">${
                      item.product?.name || item.name || 'Producto'
                    }</td>
                    <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center;">${
                      item.quantity
                    }</td>
                    <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">${formatCurrency(
                      item.price
                    )}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right; font-weight: 600;">${formatCurrency(
                      parseFloat(item.price) * item.quantity
                    )}</td>
                </tr>
            `
        )
        .join("");

      const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Confirmación de Pedido</title>
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
                        .container { max-width: 600px; margin: 20px auto; background-color: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
                        .header h1 { margin: 0; font-size: 28px; }
                        .content { padding: 30px 20px; }
                        .order-number { background-color: #f0f4ff; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px; }
                        .order-number strong { color: #667eea; font-size: 20px; }
                        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                        th { background-color: #f8f9fa; padding: 12px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #dee2e6; }
                        .summary { background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; }
                        .summary-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #dee2e6; }
                        .summary-row:last-child { border-bottom: none; }
                        .summary-total { font-size: 20px; font-weight: bold; color: #667eea; margin-top: 10px; padding-top: 15px; border-top: 2px solid #667eea; }
                        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
                        .info-box { background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin: 20px 0; color: #0c5460; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✅ ¡Pedido Confirmado!</h1>
                            <p style="margin: 10px 0 0 0; font-size: 16px;">Gracias por tu compra</p>
                        </div>
                        <div class="content">
                            <h2>¡Hola ${user.name}!</h2>
                            <p>Tu pedido ha sido recibido exitosamente y está siendo procesado. Te enviaremos actualizaciones sobre el estado de tu envío.</p>
                            
                            <div class="order-number">
                                <p style="margin: 0;">Número de Orden</p>
                                <strong>${orderNumber || `#${order_id}`}</strong>
                            </div>
                            
                            <p><strong>📅 Fecha del pedido:</strong> ${new Date(
                              created_at
                            ).toLocaleString("es-GT", {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</p>
                            
                            <h3 style="color: #495057; margin-top: 30px;">📦 Detalles del Pedido</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th style="text-align: center; width: 80px;">Cant.</th>
                                        <th style="text-align: right; width: 100px;">Precio</th>
                                        <th style="text-align: right; width: 100px;">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsList}
                                </tbody>
                            </table>
                            
                            <div class="summary">
                                <div class="summary-row">
                                    <span>Subtotal:</span>
                                    <span>${formatCurrency(subtotal)}</span>
                                </div>
                                <div class="summary-row">
                                    <span>Envío:</span>
                                    <span>${subtotal >= 300 ? 'Gratis' : 'A calcular'}</span>
                                </div>
                                <div class="summary-row summary-total">
                                    <span>Total:</span>
                                    <span>${formatCurrency(total_amount)}</span>
                                </div>
                            </div>
                            
                            <div class="info-box">
                                <strong>ℹ️ ¿Qué sigue?</strong>
                                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                                    <li>Procesaremos tu pedido en las próximas 24 horas</li>
                                    <li>Te enviaremos un correo cuando tu pedido sea enviado</li>
                                    <li>Podrás rastrear tu pedido con el número de seguimiento</li>
                                </ul>
                            </div>
                            
                            <p style="margin-top: 30px;">Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.</p>
                        </div>
                        <div class="footer">
                            <p><strong>E-commerce Guatemala</strong></p>
                            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
                            <p>Si necesitas ayuda, contacta con nuestro equipo de soporte.</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

      const textContent = `
                ¡Pedido Confirmado!

                Hola ${user.name},

                Tu pedido ha sido recibido exitosamente.

                Número de Orden: ${orderNumber || `#${order_id}`}
                Fecha: ${new Date(created_at).toLocaleString("es-GT")}

                Productos:
                ${items.map(item => `- ${item.product?.name || item.name}: ${item.quantity} x ${formatCurrency(item.price)} = ${formatCurrency(parseFloat(item.price) * item.quantity)}`).join('\n')}

                Subtotal: ${formatCurrency(subtotal)}
                Envío: ${subtotal >= 300 ? 'Gratis' : 'A calcular'}
                Total: ${formatCurrency(total_amount)}

                Te notificaremos cuando tu pedido sea enviado.
                
                Gracias por tu compra.
            `;

      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: [user.email, "delivered@resend.dev"],
        subject: `Confirmación de Pedido ${orderNumber || `#${order_id}`} - E-commerce`,
        html: htmlContent,
        text: textContent,
        tags: [{ name: "category", value: "order_confirmation" }],
      });

      if (error) {
        throw new Error(`Error sending email: ${error.message}`);
      }

      return { success: true, messageId: data.id };
    } catch (error) {
      console.error("Email service error:", error);
      throw error;
    }
  }

  async sendOrderShipped(order) {
    try {
      const {
        user,
        order_id,
        tracking_number,
        tracking_url,
        estimated_delivery,
      } = order;

      if (this.isDevelopment) {
        console.log("📧 [DEV MODE] Order Shipped Email:");
        console.log(`   To: ${user.email}`);
        console.log(`   Order ID: ${order_id}`);
        console.log(`   Tracking: ${tracking_number}`);
      }

      const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Pedido Enviado</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; background-color: #f9f9f9; }
                        .tracking-box { background-color: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
                        .button { 
                            display: inline-block; 
                            padding: 12px 24px; 
                            background-color: #007bff; 
                            color: white; 
                            text-decoration: none; 
                            border-radius: 5px; 
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>📦 Tu Pedido Está en Camino</h1>
                        </div>
                        <div class="content">
                            <h2>¡Buenas noticias, ${user.name}!</h2>
                            <p>Tu pedido #${order_id} ha sido enviado.</p>
                            
                            ${
                              tracking_number
                                ? `
                                <div class="tracking-box">
                                    <p><strong>Número de seguimiento:</strong> ${tracking_number}</p>
                                    ${
                                      estimated_delivery
                                        ? `<p><strong>Entrega estimada:</strong> ${new Date(
                                            estimated_delivery
                                          ).toLocaleDateString("es-ES")}</p>`
                                        : ""
                                    }
                                </div>
                                ${
                                  tracking_url
                                    ? `<a href="${tracking_url}" class="button">Rastrear Pedido</a>`
                                    : ""
                                }
                            `
                                : ""
                            }
                            
                            <p>Te notificaremos cuando tu pedido sea entregado.</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: [user.email, "delivered@resend.dev"],
        subject: `Pedido #${order_id} Enviado - Seguimiento Disponible`,
        html: htmlContent,
        tags: [{ name: "category", value: "order_shipped" }],
      });

      if (error) {
        throw new Error(`Error sending email: ${error.message}`);
      }

      return { success: true, messageId: data.id };
    } catch (error) {
      console.error("Email service error:", error);
      throw error;
    }
  }

  async sendOrderDelivered(order) {
    try {
      const { user, order_id, delivered_at } = order;

      if (this.isDevelopment) {
        console.log("📧 [DEV MODE] Order Delivered Email:");
        console.log(`   To: ${user.email}`);
        console.log(`   Order ID: ${order_id}`);
      }

      const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Pedido Entregado</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; background-color: #f9f9f9; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✅ Pedido Entregado</h1>
                        </div>
                        <div class="content">
                            <h2>¡Genial, ${user.name}!</h2>
                            <p>Tu pedido #${order_id} ha sido entregado exitosamente.</p>
                            <p><strong>Fecha de entrega:</strong> ${new Date(
                              delivered_at
                            ).toLocaleString("es-ES")}</p>
                            <p>Esperamos que disfrutes tu compra. ¡Gracias por confiar en nosotros!</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: [user.email, "delivered@resend.dev"],
        subject: `Pedido #${order_id} Entregado`,
        html: htmlContent,
        tags: [{ name: "category", value: "order_delivered" }],
      });

      if (error) {
        throw new Error(`Error sending email: ${error.message}`);
      }

      return { success: true, messageId: data.id };
    } catch (error) {
      console.error("Email service error:", error);
      throw error;
    }
  }

  async sendOrderCancelled(order) {
    try {
      const { user, order_id, cancellation_reason, cancelled_at } = order;

      if (this.isDevelopment) {
        console.log("📧 [DEV MODE] Order Cancelled Email:");
        console.log(`   To: ${user.email}`);
        console.log(`   Order ID: ${order_id}`);
        console.log(`   Reason: ${cancellation_reason}`);
      }

      const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Pedido Cancelado</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; background-color: #f9f9f9; }
                        .warning { background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 10px; border-radius: 5px; margin: 15px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>❌ Pedido Cancelado</h1>
                        </div>
                        <div class="content">
                            <h2>Hola ${user.name},</h2>
                            <p>Tu pedido #${order_id} ha sido cancelado.</p>
                            
                            <div class="warning">
                                <p><strong>Fecha de cancelación:</strong> ${new Date(
                                  cancelled_at
                                ).toLocaleString("es-ES")}</p>
                                ${
                                  cancellation_reason
                                    ? `<p><strong>Razón:</strong> ${cancellation_reason}</p>`
                                    : ""
                                }
                            </div>
                            
                            <p>Si realizaste un pago, el reembolso será procesado en los próximos 5-7 días hábiles.</p>
                            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: [user.email, "delivered@resend.dev"],
        subject: `Pedido #${order_id} Cancelado`,
        html: htmlContent,
        tags: [{ name: "category", value: "order_cancelled" }],
      });

      if (error) {
        throw new Error(`Error sending email: ${error.message}`);
      }

      return { success: true, messageId: data.id };
    } catch (error) {
      console.error("Email service error:", error);
      throw error;
    }
  }
}

export default new EmailService();
