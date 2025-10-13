import React from 'react';
import { Card } from '../../../components/ui/Card.jsx';
import { Package, Plus, Search, Filter, Barcode, Tag } from 'lucide-react';

export default function ProductsPage() {
  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200 rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Productos</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona el catálogo completo de productos de tu tienda
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200">
            <Filter className="h-4 w-4" />
            Filtros
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </button>
        </div>
      </div>
      
      <Card className="p-8 border-dashed border-2 border-gray-300 dark:border-gray-600 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-900">
        <div className="text-center py-12">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Package className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Sistema de Gestión de Productos
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Administra tu inventario, precios, categorías y toda la información de tus productos desde un solo lugar.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg w-fit mx-auto mb-3">
                <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Buscar</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Encuentra productos rápido</p>
            </div>
            
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg w-fit mx-auto mb-3">
                <Plus className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Crear</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Nuevos productos</p>
            </div>
            
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg w-fit mx-auto mb-3">
                <Tag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Categorizar</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Organizar por tipos</p>
            </div>
            
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg w-fit mx-auto mb-3">
                <Barcode className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Inventario</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Control de stock</p>
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