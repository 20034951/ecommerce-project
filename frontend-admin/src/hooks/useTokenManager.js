import { useEffect, useCallback } from 'react';
import { useAuth } from '../auth/AuthProvider.jsx';
import httpClient from '../api/http.js';
import { shouldRefreshToken, getTokenTimeToExpiry } from '../utils/tokenUtils.js';

/**
 * Hook personalizado para el manejo automático del token
 * Características:
 * - Refresca automáticamente el token antes de que expire
 * - Limpia tokens expirados
 * - Proporciona información sobre el estado del token
 */
export function useTokenManager() {
  const { logout, refreshToken: authRefreshToken } = useAuth();

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
        await authRefreshToken();
        return true;
      }
      return true;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      logout();
      return false;
    }
  }, [authRefreshToken, logout]);

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
    refreshToken: authRefreshToken
  };
}

export default useTokenManager;