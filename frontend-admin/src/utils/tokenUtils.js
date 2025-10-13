/**
 * Utilidades para el manejo de tokens de autenticación
 */

/**
 * Decodifica un JWT sin verificar la firma (solo para leer payload)
 * @param {string} token - Token JWT
 * @returns {Object|null} - Payload decodificado o null si es inválido
 */
export function decodeJWT(token) {
  try {
    if (!token || typeof token !== 'string') {
      return null;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    
    return decoded;
  } catch (error) {
    console.warn('Error al decodificar JWT:', error);
    return null;
  }
}

/**
 * Verifica si un token ha expirado
 * @param {string} token - Token JWT
 * @returns {boolean} - true si ha expirado, false si sigue válido
 */
export function isTokenExpired(token) {
  const payload = decodeJWT(token);
  
  if (!payload || !payload.exp) {
    return true; // Si no se puede decodificar o no tiene exp, considerar expirado
  }

  const currentTime = Date.now() / 1000; // Convertir a segundos
  return payload.exp < currentTime;
}

/**
 * Obtiene el tiempo restante hasta la expiración del token
 * @param {string} token - Token JWT
 * @returns {number} - Segundos hasta la expiración (0 si ya expiró)
 */
export function getTokenTimeToExpiry(token) {
  const payload = decodeJWT(token);
  
  if (!payload || !payload.exp) {
    return 0;
  }

  const currentTime = Date.now() / 1000;
  const timeLeft = payload.exp - currentTime;
  
  return Math.max(0, timeLeft);
}

/**
 * Verifica si un token necesita ser renovado (expira en menos de X minutos)
 * @param {string} token - Token JWT
 * @param {number} thresholdMinutes - Minutos antes de la expiración para considerar renovación
 * @returns {boolean} - true si necesita renovación
 */
export function shouldRefreshToken(token, thresholdMinutes = 5) {
  const timeLeft = getTokenTimeToExpiry(token);
  const thresholdSeconds = thresholdMinutes * 60;
  
  return timeLeft > 0 && timeLeft <= thresholdSeconds;
}

/**
 * Obtiene información del usuario desde el token
 * @param {string} token - Token JWT
 * @returns {Object|null} - Información del usuario o null
 */
export function getUserFromToken(token) {
  const payload = decodeJWT(token);
  
  if (!payload) {
    return null;
  }

  return {
    id: payload.userId || payload.id,
    email: payload.email,
    role: payload.role,
    name: payload.name,
    exp: payload.exp,
    iat: payload.iat
  };
}