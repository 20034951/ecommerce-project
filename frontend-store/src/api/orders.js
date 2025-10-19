import http from './http';

export const ordersApi = {
    /**
     * Crear un nuevo pedido
     */
    createOrder: async (orderData) => {
        const response = await http.post('/api/orders', orderData);
        return response.data;
    },

    /**
     * Obtener mis pedidos
     */
    getMyOrders: async (filters = {}) => {
        const { status, page = 1, limit = 10, search } = filters;
        const params = new URLSearchParams();
        
        if (status && status !== 'all') params.append('status', status);
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (search) params.append('search', search);

        const response = await http.get(`/api/orders?${params.toString()}`);
        return response.data;
    },

    /**
     * Obtener detalle de un pedido
     */
    getOrderById: async (orderId) => {
        const response = await http.get(`/api/orders/${orderId}`);
        return response.data;
    },

    /**
     * Cancelar un pedido
     */
    cancelOrder: async (orderId, reason) => {
        const response = await http.put(`/api/orders/${orderId}/cancel`, { reason });
        return response.data;
    },

    /**
     * Obtener historial de un pedido
     */
    getOrderHistory: async (orderId) => {
        const response = await http.get(`/api/orders/${orderId}/history`);
        return response.data;
    }
};

export default ordersApi;
