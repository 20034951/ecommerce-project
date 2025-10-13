import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authApi, httpClient } from '../api/index.js';

/**
 * Estados de autenticación
 */
const AUTH_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  ERROR: 'error'
};

/**
 * Acciones del reducer de autenticación
 */
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGOUT: 'LOGOUT',
  SET_USER: 'SET_USER',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

/**
 * Estado inicial del contexto de autenticación
 */
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  status: AUTH_STATES.IDLE
};

/**
 * Reducer para manejar el estado de autenticación
 */
function authReducer(state, action) {
  console.log('🔄 AuthReducer - Acción:', action.type, 'Estado actual loading:', state.isLoading);
  
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      console.log('⏳ Estableciendo estado de carga...');
      return {
        ...state,
        isLoading: true,
        status: AUTH_STATES.LOADING,
        error: null
      };
      
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      console.log('✅ Login exitoso');
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        status: AUTH_STATES.AUTHENTICATED
      };
      
    case AUTH_ACTIONS.LOGIN_ERROR:
      console.log('❌ Error de login');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
        status: AUTH_STATES.ERROR
      };
      
    case AUTH_ACTIONS.LOGOUT:
      console.log('👋 Logout');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        status: AUTH_STATES.UNAUTHENTICATED
      };
      
    case AUTH_ACTIONS.SET_USER:
      const hasUser = !!action.payload.user;
      console.log('👤 Estableciendo usuario:', hasUser ? 'autenticado' : 'no autenticado');
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: hasUser,
        isLoading: false,
        error: null,
        status: hasUser ? AUTH_STATES.AUTHENTICATED : AUTH_STATES.UNAUTHENTICATED
      };
      
    case AUTH_ACTIONS.CLEAR_ERROR:
      console.log('🧹 Limpiando error');
      return {
        ...state,
        error: null
      };
      
    default:
      return state;
  }
}

/**
 * Contexto de autenticación
 */
const AuthContext = createContext(null);

/**
 * Provider de autenticación que envuelve la aplicación
 */
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * Verifica si el usuario está autenticado al cargar la app
   */
  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔍 Iniciando verificación de autenticación...');
      
      try {
        const token = httpClient.getAccessToken();
        console.log('🔑 Token encontrado:', !!token);
        
        if (!token) {
          // Si no hay token, directamente marcar como no autenticado
          console.log('❌ No hay token, marcando como no autenticado');
          dispatch({ type: AUTH_ACTIONS.SET_USER, payload: { user: null } });
          return;
        }

        console.log('⏳ Iniciando verificación con backend...');
        dispatch({ type: AUTH_ACTIONS.SET_LOADING });
        
        // Verificar token con el backend con timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout de verificación')), 5000)
        );
        
        const response = await Promise.race([
          authApi.verifyToken(),
          timeoutPromise
        ]);
        
        console.log('✅ Token válido, usuario autenticado');
        dispatch({ 
          type: AUTH_ACTIONS.SET_USER, 
          payload: { user: response.user } 
        });
      } catch (error) {
        console.log('❌ Error en verificación:', error.status || 'sin status', error.message);
        
        // Para errores de autenticación (401, 403), no mostrar en consola
        if (error.status === 401 || error.status === 403) {
          console.log('🔄 Sesión expirada o inválida, limpiando tokens...');
        } else {
          console.error('💥 Error inesperado verificando autenticación:', error);
        }
        
        // Limpiar tokens inválidos
        httpClient.clearTokensFromStorage();
        console.log('🧹 Tokens limpiados, marcando como no autenticado');
        dispatch({ type: AUTH_ACTIONS.SET_USER, payload: { user: null } });
      }
    };

    checkAuth();
  }, []);

  /**
   * Inicia sesión con email y contraseña
   */
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING });
      
      const response = await authApi.login(credentials);
      
      dispatch({ 
        type: AUTH_ACTIONS.LOGIN_SUCCESS, 
        payload: { user: response.user } 
      });
      
      return response;
    } catch (error) {
      dispatch({ 
        type: AUTH_ACTIONS.LOGIN_ERROR, 
        payload: { error: error.message } 
      });
      throw error;
    }
  };

  /**
   * Registra un nuevo usuario
   */
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING });
      
      const response = await authApi.register(userData);
      
      // Después del registro, iniciar sesión automáticamente
      // TODO: Ajustar según la respuesta del backend
      if (response.user) {
        dispatch({ 
          type: AUTH_ACTIONS.LOGIN_SUCCESS, 
          payload: { user: response.user } 
        });
      }
      
      return response;
    } catch (error) {
      dispatch({ 
        type: AUTH_ACTIONS.LOGIN_ERROR, 
        payload: { error: error.message } 
      });
      throw error;
    }
  };

  /**
   * Cierra la sesión del usuario
   */
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  /**
   * Cierra la sesión localmente sin petición al servidor
   * Útil cuando el servidor ya cerró la sesión (ej: cambio de email)
   */
  const logoutLocal = () => {
    console.log('🧹 Cerrando sesión local - limpiando tokens y estado');
    // Limpiar tokens del almacenamiento local
    httpClient.clearTokensFromStorage();
    // Actualizar estado local
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  /**
   * Solicita recuperación de contraseña
   */
  const forgotPassword = async (email) => {
    try {
      return await authApi.forgotPassword(email);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Restablece la contraseña
   */
  const resetPassword = async (resetData) => {
    try {
      return await authApi.resetPassword(resetData);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Valida un token de recuperación de contraseña
   */
  const validateResetToken = async (token) => {
    try {
      return await authApi.validateResetToken(token);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Actualiza los datos del usuario
   */
  const updateUser = (userData) => {
    dispatch({ 
      type: AUTH_ACTIONS.SET_USER, 
      payload: { user: { ...state.user, ...userData } } 
    });
  };

  /**
   * Limpia los errores de autenticación
   */
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    // Estado
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    status: state.status,
    
    // Acciones
    login,
    register,
    logout,
    logoutLocal,
    forgotPassword,
    resetPassword,
    validateResetToken,
    updateUser,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para usar el contexto de autenticación
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
}

/**
 * Hook para verificar si el usuario tiene un rol específico
 */
export function useRole(requiredRole) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return false;
  }
  
  // TODO: Ajustar según la estructura de roles del backend
  const userRoles = user.roles || [];
  return userRoles.some(role => 
    typeof role === 'string' ? role === requiredRole : role.name === requiredRole
  );
}

/**
 * Hook para verificar múltiples roles
 */
export function useRoles(requiredRoles = []) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user || !Array.isArray(requiredRoles)) {
    return false;
  }
  
  const userRoles = user.roles || [];
  return requiredRoles.some(role => 
    userRoles.some(userRole => 
      typeof userRole === 'string' ? userRole === role : userRole.name === role
    )
  );
}

export default AuthProvider;