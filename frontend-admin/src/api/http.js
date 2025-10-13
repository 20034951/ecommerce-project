import Cookies from 'js-cookie';
import { isTokenExpired, shouldRefreshToken } from '../utils/tokenUtils.js';

/**
 * Cliente HTTP base con interceptores JWT y manejo de errores
 * Funcionalidades:
 * - Interceptor automático de Authorization header
 * - Refresh token automático
 * - Manejo centralizado de errores
 * - Retry automático en caso de token expirado
 */

class HttpClient {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
    this.accessToken = null;
    this.refreshTokenName = import.meta.env.VITE_REFRESH_TOKEN_COOKIE_NAME || 'refresh_token';
    this.accessTokenStorageKey = 'admin_access_token';
    this.isRefreshing = false;
    this.failedQueue = [];
    
    // Intentar recuperar el token al inicializar
    this.initializeToken();
  }

  /**
   * Inicializa el token desde sessionStorage
   */
  initializeToken() {
    try {
      const storedToken = sessionStorage.getItem(this.accessTokenStorageKey);
      if (storedToken) {
        this.accessToken = storedToken;
      }
    } catch (error) {
      console.warn('Error al recuperar token del sessionStorage:', error);
    }
  }

  /**
   * Establece el token de acceso
   */
  setAccessToken(token) {
    this.accessToken = token;
    
    // Persistir en sessionStorage para mantener en recarga de página
    try {
      if (token) {
        sessionStorage.setItem(this.accessTokenStorageKey, token);
      } else {
        sessionStorage.removeItem(this.accessTokenStorageKey);
      }
    } catch (error) {
      console.warn('Error al guardar token en sessionStorage:', error);
    }
  }

  /**
   * Obtiene el token de acceso
   */
  getAccessToken() {
    return this.accessToken;
  }

  /**
   * Elimina el token de acceso
   */
  clearAccessToken() {
    this.accessToken = null;
    
    // Eliminar del sessionStorage
    try {
      sessionStorage.removeItem(this.accessTokenStorageKey);
    } catch (error) {
      console.warn('Error al eliminar token del sessionStorage:', error);
    }
  }

  /**
   * Obtiene el refresh token de las cookies
   */
  getRefreshToken() {
    return Cookies.get(this.refreshTokenName);
  }

  /**
   * Establece el refresh token en cookies httpOnly
   */
  setRefreshToken(token) {
    // Nota: No podemos establecer cookies httpOnly desde JavaScript
    // El backend debe configurar la cookie httpOnly en la respuesta
    Cookies.set(this.refreshTokenName, token, {
      secure: import.meta.env.PROD,
      sameSite: 'strict',
      expires: 7 // 7 días
    });
  }

  /**
   * Elimina el refresh token
   */
  clearRefreshToken() {
    Cookies.remove(this.refreshTokenName);
  }

  /**
   * Verifica si hay un token de acceso disponible
   */
  hasValidToken() {
    return !!this.accessToken;
  }

  /**
   * Verifica si hay un refresh token disponible
   */
  hasRefreshToken() {
    return !!this.getRefreshToken();
  }

  /**
   * Procesa la cola de peticiones fallidas después del refresh
   */
  processQueue(error, token = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  /**
   * Intenta renovar el access token usando el refresh token
   */
  async refreshAccessToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        throw new Error('Refresh token failed');
      }

      const data = await response.json();
      this.setAccessToken(data.accessToken);
      
      // Si hay un nuevo refresh token, guardarlo también
      if (data.refreshToken) {
        this.setRefreshToken(data.refreshToken);
      }
      
      return data.accessToken;
    } catch (error) {
      this.clearAccessToken();
      this.clearRefreshToken();
      // TODO: Redirigir al login
      throw error;
    }
  }

  /**
   * Método principal para realizar peticiones HTTP
   */
  async request(url, options = {}) {
    // Verificar si el token necesita renovación antes de hacer la petición
    if (this.accessToken && shouldRefreshToken(this.accessToken)) {
      try {
        await this.refreshAccessToken();
      } catch (error) {
        console.warn('Error al renovar token automáticamente:', error);
        // Continuar con la petición, el interceptor manejará el 401 si es necesario
      }
    }

    const fullUrl = `${this.baseURL}${url}`;
    
    // Preparar headers por defecto
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Agregar Authorization header si hay token
    if (this.accessToken && !isTokenExpired(this.accessToken)) {
      defaultHeaders['Authorization'] = `Bearer ${this.accessToken}`;
    }

    // Mergear headers
    const headers = {
      ...defaultHeaders,
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
      credentials: 'include',
    };

    try {
      const response = await fetch(fullUrl, config);

      // Si es 401 y tenemos refresh token, intentar renovar
      if (response.status === 401 && this.getRefreshToken()) {
        return this.handleTokenRefresh(fullUrl, config);
      }

      // Si no es ok, lanzar error
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new HttpError(
          errorData.message || errorData.error || 'Request failed',
          response.status,
          errorData
        );
      }

      // Verificar si hay contenido para parsear
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return response;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      
      // Error de red o parsing
      throw new HttpError(
        error.message || 'Network error',
        0,
        { originalError: error }
      );
    }
  }

  /**
   * Maneja el refresh del token y reintenta la petición
   */
  async handleTokenRefresh(url, config) {
    // Si ya estamos renovando, agregar a la cola
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      }).then(token => {
        config.headers['Authorization'] = `Bearer ${token}`;
        return fetch(url, config);
      });
    }

    this.isRefreshing = true;

    try {
      const newToken = await this.refreshAccessToken();
      this.processQueue(null, newToken);
      
      // Reintentar la petición original
      config.headers['Authorization'] = `Bearer ${newToken}`;
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new HttpError(
          errorData.message || 'Request failed after token refresh',
          response.status,
          errorData
        );
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return response;
    } catch (error) {
      this.processQueue(error, null);
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  // Métodos de conveniencia
  async get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  async post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }
}

/**
 * Clase personalizada para errores HTTP
 */
export class HttpError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
  }
}

// Instancia singleton del cliente HTTP
export const httpClient = new HttpClient();

// Export por defecto
export default httpClient;