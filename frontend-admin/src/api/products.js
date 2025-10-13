import httpClient from './http.js';

/**
 * API para manejo de productos en el frontend admin
 */

export const productsApi = {
  /**
   * Obtiene todos los productos con filtros y paginación
   * @param {Object} params - Parámetros de filtrado y paginación
   * @returns {Promise<Object>} - Lista de productos paginada
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
  getById: async (id) => {
    return httpClient.get(`/api/products/${id}`);
  },

  /**
   * Crea un nuevo producto
   * @param {Object} productData - Datos del producto
   * @returns {Promise<Object>} - Producto creado
   */
  create: async (productData) => {
    return httpClient.post('/api/products', productData);
  },

  /**
   * Actualiza un producto existente
   * @param {number} id - ID del producto
   * @param {Object} productData - Datos a actualizar
   * @returns {Promise<Object>} - Producto actualizado
   */
  update: async (id, productData) => {
    return httpClient.put(`/api/products/${id}`, productData);
  },

  /**
   * Elimina un producto
   * @param {number} id - ID del producto
   * @returns {Promise<Object>} - Resultado de la operación
   */
  delete: async (id) => {
    return httpClient.delete(`/api/products/${id}`);
  },

  /**
   * Actualiza el stock de un producto
   * @param {number} id - ID del producto
   * @param {number} stock - Nuevo stock
   * @returns {Promise<Object>} - Producto actualizado
   */
  updateStock: async (id, stock) => {
    return httpClient.patch(`/api/products/${id}/stock`, { stock });
  },

  /**
   * Actualiza el precio de un producto
   * @param {number} id - ID del producto
   * @param {number} price - Nuevo precio
   * @returns {Promise<Object>} - Producto actualizado
   */
  updatePrice: async (id, price) => {
    return httpClient.patch(`/api/products/${id}/price`, { price });
  },

  /**
   * Sube una imagen para un producto
   * @param {number} id - ID del producto
   * @param {File} imageFile - Archivo de imagen
   * @returns {Promise<Object>} - URL de la imagen subida
   */
  uploadImage: async (id, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return httpClient.request(`/api/products/${id}/image`, {
      method: 'POST',
      body: formData,
      headers: {} // No establecer Content-Type para FormData
    });
  },

  /**
   * Obtiene productos con stock bajo
   * @param {number} threshold - Umbral de stock bajo
   * @returns {Promise<Array>} - Productos con stock bajo
   */
  getLowStock: async (threshold = 10) => {
    return httpClient.get(`/api/products/low-stock?threshold=${threshold}`);
  },

  /**
   * Obtiene estadísticas de productos
   * @returns {Promise<Object>} - Estadísticas
   */
  getStats: async () => {
    return httpClient.get('/api/products/stats');
  }
};

export default productsApi;