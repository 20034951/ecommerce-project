import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider.jsx';

/**
 * Guard que protege rutas que requieren autenticación de admin
 */
export function AdminRoute({ children, redirectTo = '/admin/login' }) {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
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
  if (!isAdmin()) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return children;
}

/**
 * Guard que protege rutas para usuarios no autenticados (login admin)
 */
export function PublicAdminRoute({ children, redirectTo = '/admin/dashboard' }) {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  // Redirigir al dashboard si ya está autenticado como admin
  if (isAuthenticated && isAdmin()) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

/**
 * Guard para rutas de recuperación de contraseña que permite acceso independientemente del estado de autenticación
 */
export function PasswordResetRoute({ children }) {
  const { isLoading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  // Permitir acceso sin importar el estado de autenticación
  return children;
}

/**
 * Guard que protege rutas basado en permisos específicos del admin
 */
export function AdminPermissionGuard({ 
  children, 
  requiredRoles = ['admin', 'editor'], 
  fallback = null, 
  redirectTo = '/admin/unauthorized' 
}) {
  const { isAuthenticated, isLoading, hasAnyRole } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  // Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Verificar si tiene alguno de los roles requeridos
  if (!hasAnyRole(requiredRoles)) {
    if (fallback) {
      return fallback;
    }
    return <Navigate to={redirectTo} replace />;
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
  const { isAuthenticated, isLoading, hasAnyRole } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  // Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Verificar si tiene alguno de los roles requeridos
  if (!hasAnyRole(requiredRoles)) {
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
  const { isAuthenticated, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return fallback;
  }

  if (requireAdmin && (!isAuthenticated || !isAdmin())) {
    return fallback;
  }

  if (!requireAdmin && isAuthenticated && isAdmin()) {
    return fallback;
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
export function withAdminPermissions(Component, requiredRoles = ['admin']) {
  return function ProtectedComponent(props) {
    return (
      <AdminPermissionGuard requiredRoles={requiredRoles}>
        <Component {...props} />
      </AdminPermissionGuard>
    );
  };
}