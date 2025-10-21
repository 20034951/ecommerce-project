import http from './http';

const shippingMethodsApi = {
  /**
   * Obtener todos los métodos de envío disponibles
   * @returns {Promise<Array>} Lista de métodos de envío
   */
  getAll: async () => {
    const response = await http.get('/api/shipping-methods');
    // El httpClient personalizado ya devuelve el JSON parseado directamente
    // No necesitamos acceder a .data
    return response;
  },
};

export default shippingMethodsApi;
