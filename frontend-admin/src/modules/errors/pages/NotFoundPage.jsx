import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui';
import { Home, ArrowLeft, Search, Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mb-6 shadow-xl">
            <Search className="h-16 w-16 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-9xl font-bold text-blue-600 dark:text-blue-400 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4 mb-2">Página no encontrada</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Lo sentimos, la página del panel administrativo que buscas no existe.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 shadow-lg">
            <Link to="/admin/dashboard" className="flex items-center justify-center">
              <Home className="h-4 w-4 mr-2" />
              Ir al Dashboard
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()} 
            className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Volver Atrás
          </Button>
        </div>

        {/* Enlaces adicionales */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 justify-center mb-4">
            <Compass className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Navegación rápida:</p>
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