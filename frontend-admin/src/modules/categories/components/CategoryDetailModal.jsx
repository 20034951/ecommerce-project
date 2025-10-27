import React from "react";
import { X, Package, Calendar, FileText } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";

export default function CategoryDetailModal({ isOpen, onClose, category }) {
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("es-GT", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Detalles de Categoría
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Preview Card */}
            <div className="flex items-center gap-6 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl shadow-lg"
                style={{
                  backgroundColor: `${category.color || "#6366f1"}15`,
                  color: category.color || "#6366f1",
                  border: `2px solid ${category.color || "#6366f1"}30`,
                }}
              >
                {category.emoji || "📦"}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {category.name}
                </h3>
                <div className="flex items-center gap-3">
                  <Badge variant="info">
                    <Package className="h-3 w-3 mr-1" />
                    {category.productCount || 0} productos
                  </Badge>
                  {category.parent_id && (
                    <Badge variant="default">Subcategoría</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {category.description && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Descripción
                  </h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-7">
                  {category.description}
                </p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Color */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Color
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm"
                    style={{ backgroundColor: category.color || "#6366f1" }}
                  />
                  <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                    {category.color || "#6366f1"}
                  </span>
                </div>
              </div>

              {/* Emoji */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Emoji
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{category.emoji || "📦"}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Icono
                  </span>
                </div>
              </div>

              {/* Created */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Fecha de creación
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {formatDate(category.created_at)}
                </p>
              </div>

              {/* Updated */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Última actualización
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {formatDate(category.updated_at)}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-600 dark:bg-indigo-500 rounded-lg">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total de Productos
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {category.productCount || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
