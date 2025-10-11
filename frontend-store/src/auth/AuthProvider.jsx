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
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: true,
        status: AUTH_STATES.LOADING,
        error: null
      };
      
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        status: AUTH_STATES.AUTHENTICATED
      };
      
    case AUTH_ACTIONS.LOGIN_ERROR:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
        status: AUTH_STATES.ERROR
      };
      
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        status: AUTH_STATES.UNAUTHENTICATED
      };
      
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: !!action.payload.user,
        isLoading: false,
        error: null,
        status: action.payload.user ? AUTH_STATES.AUTHENTICATED : AUTH_STATES.UNAUTHENTICATED
      };
      
    case AUTH_ACTIONS.CLEAR_ERROR:
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
      try {
        const token = httpClient.getAccessToken();
        if (!token) {
          dispatch({ type: AUTH_ACTIONS.SET_USER, payload: { user: null } });
          return;
        }

        dispatch({ type: AUTH_ACTIONS.SET_LOADING });
        
        // Verificar token con el backend
        const userData = await authApi.verifyToken();
        dispatch({ 
          type: AUTH_ACTIONS.SET_USER, 
          payload: { user: userData } 
        });
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        // Limpiar tokens inválidos
        httpClient.clearAccessToken();
        httpClient.clearRefreshToken();
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
    forgotPassword,
    resetPassword,
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