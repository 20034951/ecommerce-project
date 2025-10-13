import React from 'react';
import { Link, useRouteError, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui';
import { Home, ArrowLeft, AlertTriangle, RefreshCw, Bug, Shield } from 'lucide-react';

export default function AdminErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  const handleGoBack = () => {
    // Si hay historial, ir hacia atrás, sino ir al dashboard
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/admin/dashboard');
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  console.error('Router Error:', error);

  // Determinar el tipo de error
  let errorTitle = 'Error inesperado';
  let errorMessage = 'Ha ocurrido un error inesperado en la aplicación.';
  let statusCode = 'ERROR';
  let iconColor = 'text-red-600 dark:text-red-400';
  let bgColor = 'bg-red-100 dark:bg-red-900/30';

  if (error?.status === 404) {
    statusCode = '404';
    errorTitle = 'Página no encontrada';
    errorMessage = 'La página que buscas no existe o ha sido movida.';
    iconColor = 'text-blue-600 dark:text-blue-400';
    bgColor = 'bg-blue-100 dark:bg-blue-900/30';
  } else if (error?.status === 403) {
    statusCode = '403';
    errorTitle = 'Acceso denegado';
    errorMessage = 'No tienes permisos para acceder a esta página.';
    iconColor = 'text-orange-600 dark:text-orange-400';
    bgColor = 'bg-orange-100 dark:bg-orange-900/30';
  } else if (error?.status === 500) {
    statusCode = '500';
    errorTitle = 'Error del servidor';
    errorMessage = 'Ha ocurrido un error interno del servidor.';
    iconColor = 'text-purple-600 dark:text-purple-400';
    bgColor = 'bg-purple-100 dark:bg-purple-900/30';
  } else if (error?.message) {
    errorMessage = error.message;
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      <div className="max-w-lg w-full text-center">
        {/* Icono de error */}
        <div className="mb-8">
          <div className={`mx-auto w-24 h-24 ${bgColor} rounded-full flex items-center justify-center mb-6 shadow-lg`}>
            <AlertTriangle className={`h-12 w-12 ${iconColor}`} />
          </div>
          <h1 className="text-6xl font-bold text-red-600 dark:text-red-400 mb-4">{statusCode}</h1>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{errorTitle}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {errorMessage}
          </p>
        </div>
        
        {/* Botones de acción */}
        <div className="space-y-3">
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600" size="lg">
            <Link to="/admin/dashboard" className="flex items-center justify-center">
              <Home className="h-4 w-4 mr-2" />
              Ir al Dashboard
            </Link>
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={handleGoBack} 
              className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800" 
              size="lg"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Volver
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleRefresh} 
              className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800" 
              size="lg"
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Recargar
            </Button>
          </div>
        </div>

        {/* Información técnica (solo en desarrollo) */}
        {process.env.NODE_ENV === 'development' && error && (
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <Bug className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Información técnica:</h3>
            </div>
            <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto">
              {error.stack || JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        {/* Enlaces adicionales */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 justify-center mb-4">
            <Shield className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Enlaces útiles:</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link 
              to="/admin/users" 
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
            >
              Usuarios
            </Link>
            <Link 
              to="/admin/products" 
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
            >
              Productos
            </Link>
            <Link 
              to="/admin/categories" 
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
            >
              Categorías
            </Link>
            <Link 
              to="/admin/orders" 
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
            >
              Pedidos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}