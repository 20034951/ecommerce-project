import db from '../models/index.js';

const { PaymentMethod } = db;

/**
 * Seeder para métodos de pago
 * Este seeder es idempotente - puede ejecutarse múltiples veces sin crear duplicados
 */
async function seedPaymentMethods() {
    console.log('🔄 Iniciando seeder de métodos de pago...');

    const paymentMethods = [
        {
            name: 'Transferencia Bancaria',
            code: 'bank_transfer',
            description: 'Transferencia o depósito bancario',
            icon: 'Building2',
            display_order: 1,
            is_active: true,
        },
        {
            name: 'Tarjeta de Crédito o Débito',
            code: 'credit_card',
            description: 'Visa, MasterCard o American Express',
            icon: 'CreditCard',
            display_order: 2,
            is_active: true,
        },
        {
            name: 'Efectivo Contra Entrega',
            code: 'cash_on_delivery',
            description: 'Paga en efectivo al recibir tu pedido',
            icon: 'DollarSign',
            display_order: 3,
            is_active: true,
        },
    ];

    try {
        for (const methodData of paymentMethods) {
            // Buscar si ya existe por código
            const [paymentMethod, created] = await PaymentMethod.findOrCreate({
                where: { code: methodData.code },
                defaults: methodData,
            });

            if (created) {
                console.log(`✅ Método de pago creado: ${paymentMethod.name}`);
            } else {
                // Si ya existe, actualizar los datos
                await paymentMethod.update(methodData);
                console.log(`🔄 Método de pago actualizado: ${paymentMethod.name}`);
            }
        }

        console.log('✅ Seeder de métodos de pago completado');
        return { success: true, message: 'Métodos de pago cargados correctamente' };
    } catch (error) {
        console.error('❌ Error en seeder de métodos de pago:', error);
        throw error;
    }
}

export default seedPaymentMethods;
