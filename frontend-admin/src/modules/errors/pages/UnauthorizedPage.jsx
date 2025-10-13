import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button.jsx';
import { Card } from '../../../components/ui/Card.jsx';
import { useAuth } from '../../../auth/AuthProvider.jsx';

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/admin');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="h-10 w-10 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            403
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Acceso Denegado
          </h2>
          <p className="text-gray-600 mb-8">
            No tienes permisos suficientes para acceder a esta página.
            {user && (
              <span className="block mt-2 text-sm">
                Conectado como: <strong>{user.email}</strong>
              </span>
            )}
          </p>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Posibles razones:
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>No tienes el rol necesario para esta función</li>
                      <li>Tus permisos han sido modificados recientemente</li>
                      <li>La sesión ha expirado</li>
                      <li>Esta función requiere privilegios especiales</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="w-full"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Volver Atrás
              </Button>
              
              <Button
                onClick={handleGoHome}
                className="w-full"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Ir al Dashboard
              </Button>

              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Si crees que esto es un error, contacta al administrador del sistema.
          </p>
          <div className="mt-4">
            <Link
              to="/admin/auth/login"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              ¿Necesitas iniciar sesión con otra cuenta?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}