import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authApi } from '../api/auth.js';
import httpClient from '../api/http.js';

// Contexto de autenticación
const AuthContext = createContext(null);

// Estado inicial
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// Reducer para manejar el estado
function authReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    
    default:
      return state;
  }
}

// Proveedor de contexto
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar si tenemos un token almacenado
        if (!httpClient.hasValidToken()) {
          // Si no hay token de acceso pero hay refresh token, intentar renovar
          if (httpClient.hasRefreshToken()) {
            try {
              await httpClient.refreshAccessToken();
            } catch (error) {
              console.error('Error al renovar token:', error);
              dispatch({ type: 'LOGOUT' });
              return;
            }
          } else {
            // No hay tokens, el usuario no está autenticado
            dispatch({ type: 'LOGOUT' });
            return;
          }
        }

        // Verificar si el token es válido obteniendo el perfil del usuario
        const response = await authApi.verifyToken();
        
        // La respuesta del backend tiene la estructura: { valid: true, user: {...} }
        if (response.valid && response.user) {
          dispatch({ type: 'SET_USER', payload: response.user });
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        dispatch({ type: 'LOGOUT' });
      }
    };

    checkAuth();
  }, []);

  // Función de login
  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authApi.login(credentials);
      
      // La respuesta del backend tiene la estructura: { message, user, accessToken, refreshToken, expiresIn }
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.user,
        },
      });

      return response;
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      // Intentar hacer logout en el servidor si hay token
      if (httpClient.hasValidToken()) {
        await authApi.logout();
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar tokens y estado local independientemente del resultado
      httpClient.clearAccessToken();
      httpClient.clearRefreshToken();
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Función para verificar si el usuario tiene un rol específico
  const hasRole = (roleName) => {
    return state.user?.role === roleName;
  };

  // Función para verificar si el usuario tiene alguno de los roles especificados
  const hasAnyRole = (roleNames) => {
    return roleNames.includes(state.user?.role);
  };

  // Función para verificar si es admin o editor
  const isAdmin = () => {
    return hasAnyRole(['admin', 'editor']);
  };

  // Función para refrescar el token manualmente
  const refreshToken = async () => {
    try {
      const newToken = await httpClient.refreshAccessToken();
      // Verificar el nuevo token obteniendo datos del usuario
      const response = await authApi.verifyToken();
      if (response.valid && response.user) {
        dispatch({ type: 'SET_USER', payload: response.user });
      }
      return newToken;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      dispatch({ type: 'LOGOUT' });
      throw error;
    }
  };

  const value = {
    ...state,
    login,
    logout,
    refreshToken,
    hasRole,
    hasAnyRole,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook para obtener el usuario actual
export function useUser() {
  const { user } = useAuth();
  return user;
}

// Hook para verificar permisos
export function usePermissions() {
  const { hasRole, hasAnyRole, isAdmin } = useAuth();
  return { hasRole, hasAnyRole, isAdmin };
}