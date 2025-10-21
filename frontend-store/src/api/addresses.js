import apiClient from './http.js';

/**
 * API de direcciones
 */
export const addressesApi = {
    /**
     * Obtener todas las direcciones del usuario
     * @param {string} type - Tipo de dirección: 'shipping' o 'billing'
     */
    getAll: async (type = null) => {
        const params = type ? { type } : {};
        const response = await apiClient.get('/api/addresses', { params });
        // El httpClient ya devuelve el JSON parseado directamente
        // que contiene { success: true, data: [...] }
        return response;
    },

    /**
     * Obtener una dirección específica
     * @param {number} id - ID de la dirección
     */
    getById: async (id) => {
        const response = await apiClient.get(`/api/addresses/${id}`);
        return response;
    },

    /**
     * Crear una nueva dirección
     * @param {Object} data - Datos de la dirección
     */
    create: async (data) => {
        const response = await apiClient.post('/api/addresses', data);
        return response;
    },

    /**
     * Actualizar una dirección existente
     * @param {number} id - ID de la dirección
     * @param {Object} data - Datos actualizados
     */
    update: async (id, data) => {
        const response = await apiClient.put(`/api/addresses/${id}`, data);
        return response;
    },

    /**
     * Eliminar una dirección
     * @param {number} id - ID de la dirección
     */
    delete: async (id) => {
        const response = await apiClient.delete(`/api/addresses/${id}`);
        return response;
    }
};

export default addressesApi;
