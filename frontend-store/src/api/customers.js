import httpClient from './http.js';

/**
 * API para manejo de clientes y seguridad en el frontend store
 */

export const customersApi = {
  /**
   * Obtiene el perfil del cliente actual
   * @returns {Promise<Object>} - Datos del cliente
   */
  getProfile: async () => {
    return httpClient.get('/api/customers/profile');
  },

  /**
   * Actualiza el perfil del cliente actual
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise<Object>} - Cliente actualizado
   */
  updateProfile: async (userData) => {
    return httpClient.put('/api/customers/profile', userData);
  },

  /**
   * Obtiene las sesiones activas del cliente
   * @returns {Promise<Object>} - Lista de sesiones
   */
  getSessions: async () => {
    return httpClient.get('/api/customers/sessions');
  },

  /**
   * Cierra una sesión específica
   * @param {string} sessionId - ID de la sesión a cerrar
   * @returns {Promise<Object>} - Resultado de la operación
   */
  terminateSession: async (sessionId) => {
    return httpClient.delete(`/api/customers/sessions/${sessionId}`);
  },

  /**
   * Cierra todas las sesiones excepto la actual
   * @returns {Promise<Object>} - Resultado de la operación
   */
  terminateAllOtherSessions: async () => {
    return httpClient.delete('/api/customers/sessions');
  },

  /**
   * Cambia la contraseña del cliente
   * @param {Object} passwordData - Contraseña actual y nueva
   * @returns {Promise<Object>} - Resultado de la operación
   */
  changePassword: async (passwordData) => {
    return httpClient.put('/api/customers/password', passwordData);
  }
};

export default customersApi;