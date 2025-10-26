import http from './http';

const paymentMethodsApi = {
    /**
     * Obtener todos los métodos de pago activos disponibles
     * @returns {Promise<Array>} Lista de métodos de pago activos
     */
    getActive: async () => {
        const response = await http.get('/api/payment-methods/active');
        return response;
    },

    /**
     * Obtener todos los métodos de pago (con paginación)
     * @param {Object} params - Parámetros de consulta
     * @returns {Promise<Object>} Respuesta con métodos de pago paginados
     */
    getAll: async (params = {}) => {
        const response = await http.get('/api/payment-methods', { params });
        return response;
    },

    /**
     * Obtener un método de pago por ID
     * @param {number} id - ID del método de pago
     * @returns {Promise<Object>} Datos del método de pago
     */
    getById: async (id) => {
        const response = await http.get(`/api/payment-methods/${id}`);
        return response;
    },
};

export default paymentMethodsApi;
