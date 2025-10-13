import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui';
import { Home, ArrowLeft, AlertTriangle, Search, Compass } from 'lucide-react';

export default function AdminNotFoundPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // Si hay historial, ir hacia atrás, sino ir al dashboard
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      <div className="max-w-md w-full text-center">
        {/* Icono de error */}
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <Search className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Página no encontrada</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Lo sentimos, la página del panel administrativo que buscas no existe o ha sido movida.
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
          
          <Button 
            variant="outline" 
            onClick={handleGoBack} 
            className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800" 
            size="lg"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Volver Atrás
          </Button>
        </div>

        {/* Enlaces adicionales */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 justify-center mb-4">
            <Compass className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">¿Necesitas ayuda? Prueba estos enlaces:</p>
          </div>
          <div className="space-y-2">
            <Link 
              to="/admin/users" 
              className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
            >
              Gestión de Usuarios
            </Link>
            <Link 
              to="/admin/products" 
              className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
            >
              Gestión de Productos
            </Link>
            <Link 
              to="/admin/categories" 
              className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
            >
              Gestión de Categorías
            </Link>
            <Link 
              to="/admin/orders" 
              className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
            >
              Gestión de Pedidos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}