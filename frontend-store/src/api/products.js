import httpClient from './http.js';

export const productsApi = {
  /**
   * Obtiene todos los productos con paginación, ordenamiento y filtros opcionales
   * @param {Object} params - { page, limit, sortBy, sortOrder, ...filters }
   */
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/api/products?${queryString}` : '/api/products';
    return httpClient.get(url);
  },

  /**
   * Obtiene un producto por ID
   * @param {number} id - ID del producto
   * @returns {Promise<Object>} - Datos del producto
   */
  getById: async (id) => httpClient.get(`/api/products/${id}`),

  /**
   * Obtiene productos por categoría
   * @param {number} categoryId - ID de la categoría
   * @param {Object} params - Parámetros adicionales
   * @returns {Promise<Object>} - Productos de la categoría
   */
  getByCategory: async (categoryId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return queryString
      ? httpClient.get(`/api/products/category/${categoryId}?${queryString}`)
      : httpClient.get(`/api/products/category/${categoryId}`);
  },

  /**
   * Busca productos por término de búsqueda
   * @param {string} query - Término de búsqueda
   * @returns {Promise<Object>} - Resultados de búsqueda
   */
  search: async (query) => {
    return httpClient.get(`/api/products/search?q=${encodeURIComponent(query)}`);
  }
}

export default productsApi;
