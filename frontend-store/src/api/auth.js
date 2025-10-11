import httpClient from './http.js';

/**
 * API para autenticación en el frontend store
 */

export const authApi = {
  /**
   * Inicia sesión con email y contraseña
   * @param {Object} credentials - Email y contraseña
   * @returns {Promise<Object>} - Token y datos del usuario
   */
  login: async (credentials) => {
    const response = await httpClient.post('/api/auth/login', credentials);
    
    // Guardar tokens después del login exitoso
    if (response.accessToken) {
      httpClient.setAccessToken(response.accessToken);
    }
    if (response.refreshToken) {
      httpClient.setRefreshToken(response.refreshToken);
    }
    
    return response;
  },

  /**
   * Cierra la sesión del usuario
   * @returns {Promise<Object>} - Resultado de la operación
   */
  logout: async () => {
    try {
      const response = await httpClient.post('/api/auth/logout');
      return response;
    } finally {
      // Limpiar tokens independientemente del resultado
      httpClient.clearAccessToken();
      httpClient.clearRefreshToken();
    }
  },

  /**
   * Registra un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} - Usuario registrado
   */
  register: async (userData) => {
    return httpClient.post('/api/register', userData);
  },

  /**
   * Solicita recuperación de contraseña
   * @param {string} email - Email del usuario
   * @returns {Promise<Object>} - Resultado de la operación
   */
  forgotPassword: async (email) => {
    return httpClient.post('/api/auth/forgot-password', { email });
  },

  /**
   * Restablece la contraseña con token
   * @param {Object} resetData - Token y nueva contraseña
   * @returns {Promise<Object>} - Resultado de la operación
   */
  resetPassword: async (resetData) => {
    return httpClient.post('/api/auth/reset-password', resetData);
  },

  /**
   * Verifica el token actual
   * @returns {Promise<Object>} - Datos del usuario si el token es válido
   */
  verifyToken: async () => {
    return httpClient.get('/api/auth/verify');
  },

  /**
   * Refresca el token de acceso
   * @returns {Promise<Object>} - Nuevo token de acceso
   */
  refreshToken: async () => {
    return httpClient.post('/api/auth/refresh');
  }
};

export default authApi;