import { useEffect, useCallback } from 'react';
import httpClient from '../api/http.js';
import { shouldRefreshToken, getTokenTimeToExpiry } from '../utils/tokenUtils.js';

/**
 * Hook simplificado para el manejo automático del token
 * No depende del AuthProvider para evitar dependencias circulares
 */
export function useSimpleTokenManager() {
  /**
   * Verifica y refresca el token si es necesario
   */
  const checkAndRefreshToken = useCallback(async () => {
    const currentToken = httpClient.getAccessToken();
    
    if (!currentToken) {
      return false;
    }

    try {
      if (shouldRefreshToken(currentToken)) {
        console.log('Refrescando token automáticamente...');
        await httpClient.refreshAccessToken();
        return true;
      }
      return true;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      // Limpiar tokens si hay error
      httpClient.clearAccessToken();
      httpClient.clearRefreshToken();
      return false;
    }
  }, []);

  /**
   * Obtiene información sobre el token actual
   */
  const getTokenInfo = useCallback(() => {
    const token = httpClient.getAccessToken();
    
    if (!token) {
      return {
        hasToken: false,
        timeToExpiry: 0,
        needsRefresh: false
      };
    }

    const timeToExpiry = getTokenTimeToExpiry(token);
    const needsRefresh = shouldRefreshToken(token);

    return {
      hasToken: true,
      timeToExpiry,
      needsRefresh,
      expiresIn: Math.floor(timeToExpiry / 60) // minutos
    };
  }, []);

  // Configurar intervalo para verificar el token periódicamente
  useEffect(() => {
    const interval = setInterval(() => {
      checkAndRefreshToken();
    }, 60000); // Verificar cada minuto

    // Verificar inmediatamente al montar
    checkAndRefreshToken();

    return () => clearInterval(interval);
  }, [checkAndRefreshToken]);

  return {
    checkAndRefreshToken,
    getTokenInfo,
    refreshToken: () => httpClient.refreshAccessToken()
  };
}

export default useSimpleTokenManager;