import React from 'react';
import { Card } from '../../../components/ui/Card.jsx';
import { Package, ArrowLeft, Edit, Eye, Star, DollarSign, BarChart3, History } from 'lucide-react';

export default function ProductDetailPage() {
  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200 rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200">
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Detalle de Producto</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Visualiza y edita toda la información completa del producto
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
          <Edit className="h-4 w-4" />
          Editar Producto
        </button>
      </div>
      
      <Card className="p-8 border-dashed border-2 border-gray-300 dark:border-gray-600 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <div className="text-center py-12">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Package className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Vista Detallada del Producto
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Aquí encontrarás toda la información del producto, incluyendo especificaciones, precios, inventario y estadísticas de ventas.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg w-fit mx-auto mb-3">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Pricing</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Precios y costos</p>
            </div>
            
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg w-fit mx-auto mb-3">
                <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Reseñas</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Calificaciones</p>
            </div>
            
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg w-fit mx-auto mb-3">
                <BarChart3 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Estadísticas</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Métricas de venta</p>
            </div>
            
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg w-fit mx-auto mb-3">
                <History className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Historial</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Cambios recientes</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-lg text-sm">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            Esta funcionalidad estará disponible próximamente
          </div>
        </div>
      </Card>
    </div>
  );
}