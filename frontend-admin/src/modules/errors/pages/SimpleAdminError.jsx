import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft, Bug, RefreshCw } from 'lucide-react';

export default function SimpleAdminError() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/admin/dashboard');
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-6xl font-bold text-red-600 dark:text-red-400 mb-4">ERROR</h1>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error inesperado</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ha ocurrido un error inesperado en la aplicación.
          </p>
        </div>
        
        <div className="space-y-3">
          <Link 
            to="/admin/dashboard"
            className="inline-flex items-center justify-center w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <Home className="h-4 w-4 mr-2" />
            Ir al Dashboard
          </Link>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleGoBack}
              className="inline-flex items-center justify-center w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </button>
            
            <button 
              onClick={handleRefresh}
              className="inline-flex items-center justify-center w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Recargar
            </button>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center gap-2 justify-center mb-2">
            <Bug className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Sugerencias para solucionar:</p>
          </div>
          <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
            <li>• Recarga la página</li>
            <li>• Verifica tu conexión a internet</li>
            <li>• Limpia el caché del navegador</li>
            <li>• Intenta nuevamente en unos minutos</li>
          </ul>
        </div>

        {/* Enlaces de navegación */}
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Enlaces rápidos:</p>
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