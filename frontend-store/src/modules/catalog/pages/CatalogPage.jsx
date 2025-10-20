import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productsApi from '../../../api/products';
import { toast } from 'react-hot-toast';
import ProductCard from '../components/ProductCard';

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
    <div className="container mx-auto px-4 py-8">

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">{TITLE}</h1>
        <div className="flex gap-2 flex-wrap items-center">
          <div>
            <label className="mr-2 text-gray-700 font-medium">{SHOW}</label>
            <select
              className="border rounded p-1"
              value={limit}
              onChange={handleLimitChange}>
              {limitOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mr-2 text-gray-700 font-medium">{SORT_BY}</label>
            <select
              className="border rounded p-1"
              value={sortBy}
              onChange={handleSortByChange}>
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mr-2 text-gray-700 font-medium">{ORDER}</label>
            <select
              className="border rounded p-1"
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

      {loading ? (
        <p className="text-gray-500">{LOADING}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      )}

      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50">
          {PREV}
        </button>
        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => handlePageChange(p)}
            className={`px-3 py-1 border rounded ${p === page ? 'bg-indigo-600 text-white' : ''}`}>
            {p}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === pagination.totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50">
          {NEXT}
        </button>
      </div>
    </div>
  );
}
