import React from 'react';
import { Users, Package, DollarSign, ShoppingCart, TrendingUp, Activity } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200 rounded-xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Panel de Administración
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bienvenido al panel de control principal
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-soft hover:shadow-soft-lg transition-all duration-200 border border-gray-100 dark:border-gray-800 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform duration-200">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Usuarios</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">1,234</p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">+12% este mes</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-soft hover:shadow-soft-lg transition-all duration-200 border border-gray-100 dark:border-gray-800 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg group-hover:scale-110 transition-transform duration-200">
              <Package className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Productos</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">567</p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">+8% este mes</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-soft hover:shadow-soft-lg transition-all duration-200 border border-gray-100 dark:border-gray-800 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg group-hover:scale-110 transition-transform duration-200">
              <DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Ventas</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">$89,234</p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">+24% este mes</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-soft hover:shadow-soft-lg transition-all duration-200 border border-gray-100 dark:border-gray-800 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform duration-200">
              <ShoppingCart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Pedidos</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">456</p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">+16% este mes</p>
        </div>
      </div>
    </div>
  );
}
