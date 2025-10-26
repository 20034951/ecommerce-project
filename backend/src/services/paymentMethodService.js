import db from '../models/index.js';
import Paginator from '../utils/Paginator.js';

const { PaymentMethod } = db;

class PaymentMethodService {
    /**
     * Obtener todos los métodos de pago (con paginación opcional)
     */
    async getAll(query = {}) {
        const paginator = new Paginator(PaymentMethod, query);

        paginator
            .allowFilter(['name', 'code', 'is_active'])
            .allowSort(['name', 'display_order', 'created_at'])
            .defaultSort('display_order', 'ASC');

        return await paginator.paginate();
    }

    /**
     * Obtener métodos de pago activos (sin paginación)
     */
    async getActive() {
        return await PaymentMethod.findAll({
            where: { is_active: true },
            order: [['display_order', 'ASC']],
        });
    }

    /**
     * Obtener un método de pago por ID
     */
    async getById(id) {
        const paymentMethod = await PaymentMethod.findByPk(id);

        if (!paymentMethod) {
            const error = new Error('Método de pago no encontrado');
            error.statusCode = 404;
            throw error;
        }

        return paymentMethod;
    }

    /**
     * Obtener un método de pago por código
     */
    async getByCode(code) {
        const paymentMethod = await PaymentMethod.findOne({
            where: { code }
        });

        if (!paymentMethod) {
            const error = new Error('Método de pago no encontrado');
            error.statusCode = 404;
            throw error;
        }

        return paymentMethod;
    }

    /**
     * Crear un nuevo método de pago
     */
    async create(data) {
        const { name, code, description, icon, display_order } = data;

        // Verificar si ya existe un método con el mismo código
        const existing = await PaymentMethod.findOne({ where: { code } });
        if (existing) {
            const error = new Error('Ya existe un método de pago con este código');
            error.statusCode = 400;
            throw error;
        }

        const paymentMethod = await PaymentMethod.create({
            name,
            code,
            description,
            icon,
            display_order: display_order || 0,
            is_active: true,
        });

        return paymentMethod;
    }

    /**
     * Actualizar un método de pago
     */
    async update(id, data) {
        const paymentMethod = await this.getById(id);

        const { name, code, description, icon, display_order, is_active } = data;

        // Si se está cambiando el código, verificar que no exista otro con ese código
        if (code && code !== paymentMethod.code) {
            const existing = await PaymentMethod.findOne({ where: { code } });
            if (existing) {
                const error = new Error('Ya existe un método de pago con este código');
                error.statusCode = 400;
                throw error;
            }
        }

        await paymentMethod.update({
            name: name !== undefined ? name : paymentMethod.name,
            code: code !== undefined ? code : paymentMethod.code,
            description: description !== undefined ? description : paymentMethod.description,
            icon: icon !== undefined ? icon : paymentMethod.icon,
            display_order: display_order !== undefined ? display_order : paymentMethod.display_order,
            is_active: is_active !== undefined ? is_active : paymentMethod.is_active,
        });

        return paymentMethod;
    }

    /**
     * Eliminar (desactivar) un método de pago
     */
    async delete(id) {
        const paymentMethod = await this.getById(id);

        // En lugar de eliminar, solo desactivamos
        await paymentMethod.update({ is_active: false });

        return { message: 'Método de pago desactivado correctamente' };
    }

    /**
     * Activar un método de pago
     */
    async activate(id) {
        const paymentMethod = await this.getById(id);
        await paymentMethod.update({ is_active: true });
        return paymentMethod;
    }
}

export default new PaymentMethodService();
