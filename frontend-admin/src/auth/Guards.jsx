import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, useRole, useRoles } from './AuthProvider.jsx';

/**
 * Guard que protege rutas que requieren autenticación de admin
 */
export function AdminRoute({ children, redirectTo = '/admin/login' }) {
  const { isAuthenticated, isLoading } = useAuth();
  const hasAdminRole = useRole('admin');
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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

  // Redirigir si no tiene permisos de admin
  if (!hasAdminRole) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return children;
}

/**
 * Guard que protege rutas para usuarios no autenticados (login admin)
 */
export function PublicAdminRoute({ children, redirectTo = '/admin/dashboard' }) {
  const { isAuthenticated, isLoading } = useAuth();
  const hasAdminRole = useRole('admin');

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirigir al dashboard si ya está autenticado como admin
  if (isAuthenticated && hasAdminRole) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

/**
 * Guard que protege rutas basado en permisos específicos del admin
 */
export function AdminPermissionGuard({ 
  children, 
  requiredPermissions = [], 
  fallback = null, 
  redirectTo = '/admin/unauthorized' 
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const hasAdminRole = useRole('admin');

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Redirigir si no tiene rol de admin
  if (!hasAdminRole) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  // Verificar permisos específicos (si se implementan)
  if (requiredPermissions.length > 0 && user?.permissions) {
    const hasRequiredPermissions = requiredPermissions.every(permission =>
      user.permissions.includes(permission)
    );

    if (!hasRequiredPermissions) {
      if (fallback) {
        return fallback;
      }
      return <Navigate to={redirectTo} replace />;
    }
  }

  return children;
}

/**
 * Guard que protege rutas basado en roles específicos del admin
 */
export function AdminRoleGuard({ 
  children, 
  requiredRoles = ['admin'], 
  fallback = null, 
  redirectTo = '/admin/unauthorized' 
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const hasAnyRole = useRoles(requiredRoles);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
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
 * Componente que renderiza contenido condicionalmente para admin
 */
export function AdminGuard({ children, fallback = null, requireAdmin = true }) {
  const { isAuthenticated, isLoading } = useAuth();
  const hasAdminRole = useRole('admin');

  if (isLoading) {
    return fallback;
  }

  if (requireAdmin && (!isAuthenticated || !hasAdminRole)) {
    return fallback;
  }

  if (!requireAdmin && isAuthenticated && hasAdminRole) {
    return fallback;
  }

  return children;
}

/**
 * Componente que renderiza contenido condicionalmente basado en permisos admin
 */
export function AdminPermissionCheck({ children, requiredPermissions = [], fallback = null }) {
  const { user } = useAuth();
  const hasAdminRole = useRole('admin');

  if (!hasAdminRole) {
    return fallback;
  }

  if (requiredPermissions.length > 0 && user?.permissions) {
    const hasRequiredPermissions = requiredPermissions.every(permission =>
      user.permissions.includes(permission)
    );

    if (!hasRequiredPermissions) {
      return fallback;
    }
  }

  return children;
}

/**
 * HOC para proteger componentes con autenticación admin
 */
export function withAdminAuth(Component) {
  return function ProtectedComponent(props) {
    return (
      <AdminRoute>
        <Component {...props} />
      </AdminRoute>
    );
  };
}

/**
 * HOC para proteger componentes con permisos específicos
 */
export function withAdminPermissions(Component, requiredPermissions = []) {
  return function ProtectedComponent(props) {
    return (
      <AdminPermissionGuard requiredPermissions={requiredPermissions}>
        <Component {...props} />
      </AdminPermissionGuard>
    );
  };
}