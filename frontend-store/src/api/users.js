import httpClient from './http.js';
import { customersApi } from './customers.js';

/**
 * API para manejo de usuarios en el frontend store
 */

export const usersApi = {
  /**
   * Registra un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} - Usuario creado
   */
  register: async (userData) => {
    return httpClient.post('/api/users', userData);
  },

  /**
   * Obtiene el perfil del usuario actual
   * @returns {Promise<Object>} - Datos del usuario
   */
  getProfile: async () => {
    return customersApi.getProfile();
  },

  /**
   * Actualiza el perfil del usuario actual
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise<Object>} - Usuario actualizado
   */
  updateProfile: async (userData) => {
    return customersApi.updateProfile(userData);
  },

  /**
   * Cambia la contraseña del usuario
   * @param {Object} passwordData - Contraseñas actual y nueva
   * @returns {Promise<Object>} - Resultado de la operación
   */
  changePassword: async (passwordData) => {
    return customersApi.changePassword(passwordData);
  },

  /**
   * Desactiva la cuenta del usuario
   * @returns {Promise<Object>} - Resultado de la operación
   */
  deactivateAccount: async () => {
    return httpClient.patch('/api/users/deactivate');
  }
};

export default usersApi;