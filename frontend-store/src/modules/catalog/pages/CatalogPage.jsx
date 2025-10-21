import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productsApi from '../../../api/products';
import { toast } from 'react-hot-toast';
import ProductCard from '../components/ProductCard';
import { 
  Package, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight,
  Loader2
} from 'lucide-react';

export default function CatalogPage() {
  const navigate = useNavigate();
  const defaultLimit = parseInt(localStorage.getItem('productsPerPage')) || 8;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);
  const [pagination, setPagination] = useState({ totalItems: 0, totalPages: 0, page: 1, limit: limit });
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchProducts = async (currentPage = 1, currentLimit = limit) => {
    setLoading(true);
    try {
      const res = await productsApi.getAll({
        page: currentPage,
        limit: currentLimit,
        sortBy,
        sortOrder
      });
      setProducts(res.items);
      setPagination(res.pagination);
      setPage(res.pagination.page);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page, limit);
  }, [page, limit, sortBy, sortOrder]);

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setLimit(newLimit);
    localStorage.setItem('productsPerPage', newLimit);
    setPage(1);
  };

  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPage(newPage);
  };

  //This can be a generic setting
  const limitOptions = Array.from({ length: 10 }, (_, i) => (i + 1) * 4);

  const TITLE = "Catálogo de Productos";
  const SHOW = "Mostrar:";
  const SORT_BY = "Ordenar por:";
  const ORDER = "Orden:";
  const LOADING = "Cargando productos...";
  const PREV = "Anterior";
  const NEXT = "Siguiente";

  const sortOptions = [
    { value: "name", label: "Nombre" },
    { value: "price", label: "Precio" },
    { value: "created_at", label: "Creación" },
  ];
  const orderByOptions = [
    { value: "asc", label: "Ascendente" },
    { value: "desc", label: "Descendente" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">

        {/* Header con título e iconos */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
              <Package className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{TITLE}</h1>
          </div>

          {/* Controles de filtrado */}
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <SlidersHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">{SHOW}</span>
              <select
                className="bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white font-medium cursor-pointer"
                value={limit}
                onChange={handleLimitChange}>
                {limitOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300 font-medium">{SORT_BY}</span>
              <select
                className="bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white font-medium cursor-pointer"
                value={sortBy}
                onChange={handleSortByChange}>
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300 font-medium">{ORDER}</span>
              <select
                className="bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white font-medium cursor-pointer"
                value={sortOrder}
                onChange={handleSortOrderChange}>
                {orderByOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Grid de productos con loading state mejorado */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">{LOADING}</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <Package className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No hay productos disponibles</p>
          </div>
        )}

        {/* Paginación mejorada */}
        {!loading && products.length > 0 && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-750 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
              <ChevronLeft className="w-4 h-4" />
              {PREV}
            </button>

            <div className="flex gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition-all duration-200 
                    ${p === page 
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-md' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'
                    }`}>
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pagination.totalPages}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-750 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
              {NEXT}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
