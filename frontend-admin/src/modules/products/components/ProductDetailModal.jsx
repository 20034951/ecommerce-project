import React from 'react';
import { X, Package, DollarSign, Hash, Barcode, FileText, Tag, Calendar } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge.jsx';

export default function ProductDetailModal({ isOpen, onClose, product }) {
  if (!isOpen || !product) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStockBadge = (stock) => {
    if (stock === 0) {
      return <Badge variant="error">Agotado</Badge>;
    } else if (stock <= 10) {
      return <Badge variant="warning">Stock bajo</Badge>;
    } else {
      return <Badge variant="success">En stock</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Detalles del Producto
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Información completa del producto
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Imagen y info básica */}
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Imagen */}
              <div className="flex-shrink-0">
                <div className="w-48 h-48 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center">
                  {product.image_path ? (
                    <img 
                      src={product.image_path} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="h-20 w-20 text-gray-400 dark:text-gray-500" />
                  )}
                </div>
              </div>

              {/* Info básica */}
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {product.name}
                  </h3>
                  {product.sku && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Barcode className="h-4 w-4" />
                      <span className="text-sm">SKU: {product.sku}</span>
                    </div>
                  )}
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-100 dark:border-indigo-900/30">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-xs font-medium">Precio</span>
                    </div>
                    <p className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
                      {formatPrice(product.price)}
                    </p>
                  </div>

                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-100 dark:border-emerald-900/30">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                      <Hash className="h-4 w-4" />
                      <span className="text-xs font-medium">Stock</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                        {product.stock}
                      </p>
                      {getStockBadge(product.stock)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Descripción */}
            {product.description && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Descripción
                  </h4>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Categoría */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Categoría
                </h4>
              </div>
              <div className="inline-flex items-center px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium">
                {product.category?.name || 'Sin categoría'}
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Fecha de Creación
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(product.created_at)}
                </p>
              </div>

              {product.updated_at && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Última Actualización
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(product.updated_at)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
