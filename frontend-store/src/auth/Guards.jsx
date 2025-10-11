import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, useRole, useRoles } from './AuthProvider.jsx';

/**
 * Guard que protege rutas que requieren autenticación
 */
export function PrivateRoute({ children, redirectTo = '/login' }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  return children;
}

/**
 * Guard que protege rutas para usuarios no autenticados (login, register)
 */
export function PublicRoute({ children, redirectTo = '/' }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirigir al dashboard si ya está autenticado
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

/**
 * Guard que protege rutas basado en roles específicos
 */
export function RoleGuard({ children, requiredRole, fallback = null, redirectTo = '/unauthorized' }) {
  const { isAuthenticated, isLoading } = useAuth();
  const hasRole = useRole(requiredRole);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si tiene el rol requerido
  if (!hasRole) {
    if (fallback) {
      return fallback;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

/**
 * Guard que protege rutas basado en múltiples roles (OR logic)
 */
export function MultiRoleGuard({ children, requiredRoles = [], fallback = null, redirectTo = '/unauthorized' }) {
  const { isAuthenticated, isLoading } = useAuth();
  const hasAnyRole = useRoles(requiredRoles);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si tiene alguno de los roles requeridos
  if (!hasAnyRole) {
    if (fallback) {
      return fallback;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

/**
 * Componente que renderiza contenido condicionalmente basado en autenticación
 */
export function AuthGuard({ children, fallback = null, requireAuth = true }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return fallback;
  }

  if (requireAuth && !isAuthenticated) {
    return fallback;
  }

  if (!requireAuth && isAuthenticated) {
    return fallback;
  }

  return children;
}

/**
 * Componente que renderiza contenido condicionalmente basado en roles
 */
export function RoleCheck({ children, requiredRole, fallback = null }) {
  const hasRole = useRole(requiredRole);

  if (!hasRole) {
    return fallback;
  }

  return children;
}

/**
 * Componente que renderiza contenido condicionalmente basado en múltiples roles
 */
export function MultiRoleCheck({ children, requiredRoles = [], fallback = null }) {
  const hasAnyRole = useRoles(requiredRoles);

  if (!hasAnyRole) {
    return fallback;
  }

  return children;
}