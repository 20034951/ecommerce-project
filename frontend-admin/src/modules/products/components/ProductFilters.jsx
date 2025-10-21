import React, { useState, useEffect } from 'react';
import { Search, X, Filter, ChevronDown } from 'lucide-react';
import { categoriesApi } from '../../../api/categories.js';

export default function ProductFilters({ filters, onFiltersChange }) {
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoriesApi.getAll();
      setCategories(response.data || response || []);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const handleSearchChange = (e) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const handleCategoryChange = (e) => {
    onFiltersChange({ ...filters, category_id: e.target.value || null });
  };

  const handleStockStatusChange = (e) => {
    onFiltersChange({ ...filters, stockStatus: e.target.value || null });
  };

  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split(':');
    onFiltersChange({ ...filters, sortBy, sortOrder });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      category_id: null,
      stockStatus: null,
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  const hasActiveFilters = filters.category_id || filters.stockStatus || filters.search;

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda principal */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            value={filters.search || ''}
            onChange={handleSearchChange}
            placeholder="Buscar por nombre, SKU o descripción..."
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200 border border-gray-300 dark:border-gray-600"
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filtros</span>
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 bg-indigo-600 dark:bg-indigo-500 text-white text-xs rounded-full">
              {[filters.category_id, filters.stockStatus, filters.search].filter(Boolean).length}
            </span>
          )}
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Panel de filtros expandible */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoría
              </label>
              <select
                value={filters.category_id || ''}
                onChange={handleCategoryChange}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-200"
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Estado de stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estado de Stock
              </label>
              <select
                value={filters.stockStatus || ''}
                onChange={handleStockStatusChange}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-200"
              >
                <option value="">Todos</option>
                <option value="in-stock">En stock</option>
                <option value="low-stock">Stock bajo (≤10)</option>
                <option value="out-of-stock">Agotado</option>
              </select>
            </div>

            {/* Ordenar por */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ordenar por
              </label>
              <select
                value={`${filters.sortBy}:${filters.sortOrder}`}
                onChange={handleSortChange}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-200"
              >
                <option value="name:asc">Nombre (A-Z)</option>
                <option value="name:desc">Nombre (Z-A)</option>
                <option value="price:asc">Precio (menor a mayor)</option>
                <option value="price:desc">Precio (mayor a menor)</option>
                <option value="stock:asc">Stock (menor a mayor)</option>
                <option value="stock:desc">Stock (mayor a menor)</option>
                <option value="created_at:desc">Más recientes</option>
                <option value="created_at:asc">Más antiguos</option>
              </select>
            </div>

            {/* Botón limpiar */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="h-4 w-4" />
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
