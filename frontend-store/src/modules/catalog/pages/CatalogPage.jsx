import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import productsApi from "../../../api/products";
import categoriesApi from "../../../api/categories";
import { toast } from "react-hot-toast";
import ProductCard from "../components/ProductCard";
import SearchableSelect from "../../../components/ui/SearchableSelect";
import MultiSelectSearchable from "../../../components/ui/MultiSelectSearchable";
import {
  Package,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  Grid3x3,
  ArrowUpDown,
  Layers,
  Search,
} from "lucide-react";

export default function CatalogPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultLimit = parseInt(localStorage.getItem("productsPerPage")) || 8;
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    page: 1,
    limit: limit,
  });
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedCategories, setSelectedCategories] = useState(() => {
    // Inicializar desde URL (soporta múltiples category_id o category)
    const categoryParam =
      searchParams.get("category_id") || searchParams.get("category");
    return categoryParam ? categoryParam.split(",").filter(Boolean) : [];
  });
  const [searchQuery, setSearchQuery] = useState(() => {
    // Inicializar desde URL parámetro 'q'
    return searchParams.get("q") || "";
  });

  // Cargar categorías al montar
  useEffect(() => {
    fetchCategories();
  }, []);

  // Sincronizar categorías y búsqueda desde URL
  useEffect(() => {
    const categoryFromUrl =
      searchParams.get("category_id") || searchParams.get("category");
    const searchFromUrl = searchParams.get("q");

    if (categoryFromUrl) {
      const categoriesArray = categoryFromUrl.split(",").filter(Boolean);
      setSelectedCategories(categoriesArray);
    } else {
      setSelectedCategories([]);
    }

    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    } else {
      setSearchQuery("");
    }
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchProducts = async (
    currentPage = 1,
    currentLimit = limit,
    categoryIds = selectedCategories,
    query = searchQuery
  ) => {
    // Marcar que estamos cargando
    setLoading(true);

    // Delay mínimo de 150ms antes de mostrar el loading spinner
    const minLoadingTime = 150;
    const loadingTimer = setTimeout(() => {
      setShowLoading(true);
    }, minLoadingTime);

    try {
      const params = {
        page: currentPage,
        limit: currentLimit,
        sortBy,
        sortOrder,
      };

      // Si hay categorías seleccionadas, enviar como string separada por comas
      if (categoryIds && categoryIds.length > 0) {
        params.category_id = categoryIds.join(",");
      }

      // Si hay búsqueda, agregarla a los parámetros
      if (query && query.trim()) {
        params.name = query.trim();
      }

      const res = await productsApi.getAll(params);

      // Limpiar el timer si la respuesta fue rápida
      clearTimeout(loadingTimer);

      setProducts(res.items);
      setPagination(res.pagination);
      setPage(res.pagination.page);
    } catch (err) {
      console.error("Error fetching products:", err);
      clearTimeout(loadingTimer);
    } finally {
      // Pequeño delay para transición suave si el loading se mostró
      if (showLoading) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      setLoading(false);
      setShowLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page, limit, selectedCategories, searchQuery);
  }, [page, limit, sortBy, sortOrder, selectedCategories, searchQuery]);


  //Actualizar lista de productos despues de checkout
  const onCheckoutSuccess = () => {
    fetchProducts(page, limit);
  };

  //Mostrar Stock disponible
  products.map(product => (
    <div key={product.product_id}>
      <p>Stock disponible: {product.stock_quantity}</p>
    </div>
  ));



  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setLimit(newLimit);
    localStorage.setItem("productsPerPage", newLimit);
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

  const handleCategoryChange = (categoryIds) => {
    setSelectedCategories(categoryIds);
    setPage(1);

    // Actualizar URL manteniendo otros parámetros
    const newParams = {};
    if (categoryIds && categoryIds.length > 0) {
      newParams.category = categoryIds.join(",");
    }
    if (searchQuery) {
      newParams.q = searchQuery;
    }
    setSearchParams(newParams);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setPage(1);

    // Actualizar URL eliminando el parámetro 'q'
    const newParams = {};
    if (selectedCategories.length > 0) {
      newParams.category = selectedCategories.join(",");
    }
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPage(newPage);
  };

  //This can be a generic setting
  const limitOptions = Array.from({ length: 10 }, (_, i) => (i + 1) * 4);

  const TITLE = "Catálogo de Productos";
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

  // Formatear categorías para el MultiSelectSearchable
  const categoryOptions = categories.map((cat) => ({
    value: cat.category_id.toString(),
    label: cat.name,
  }));

  // Formatear opciones de límite
  const limitOptionsFormatted = limitOptions.map((opt) => ({
    value: opt.toString(),
    label: `${opt} productos`,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
            <Package className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {TITLE}
          </h1>
        </div>

        {/* Controles de filtrado y ordenamiento */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-8 shadow-sm">
          {/* Badge de búsqueda activa */}
          {searchQuery && (
            <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Buscando:
                </span>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm font-medium">
                  <Search className="w-3.5 h-3.5" />"{searchQuery}"
                  <button
                    onClick={handleClearSearch}
                    className="ml-1 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 rounded p-0.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro de categorías (múltiples) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Categorías
              </label>
              <MultiSelectSearchable
                options={categoryOptions}
                values={selectedCategories}
                onChange={handleCategoryChange}
                placeholder="Seleccionar categorías"
                emptyMessage="No se encontraron categorías"
                maxDisplay={2}
              />
            </div>

            {/* Mostrar */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Grid3x3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Mostrar
              </label>
              <SearchableSelect
                options={limitOptionsFormatted}
                value={limit.toString()}
                onChange={(val) => {
                  const newLimit = parseInt(val);
                  setLimit(newLimit);
                  localStorage.setItem("productsPerPage", newLimit);
                  setPage(1);
                }}
                placeholder="Productos por página"
              />
            </div>

            {/* Ordenar por */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Ordenar por
              </label>
              <SearchableSelect
                options={sortOptions}
                value={sortBy}
                onChange={(val) => {
                  setSortBy(val);
                  setPage(1);
                }}
                placeholder="Seleccionar campo"
              />
            </div>

            {/* Orden */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <ArrowUpDown className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Orden
              </label>
              <SearchableSelect
                options={orderByOptions}
                value={sortOrder}
                onChange={(val) => {
                  setSortOrder(val);
                  setPage(1);
                }}
                placeholder="Seleccionar orden"
              />
            </div>
          </div>

          {/* Badges de filtros activos */}
          {selectedCategories.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Filtrado por:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((catId) => {
                    const category = categoryOptions.find(
                      (cat) => cat.value === catId
                    );
                    return (
                      <div
                        key={catId}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        {category?.label}
                        <button
                          onClick={() =>
                            handleCategoryChange(
                              selectedCategories.filter((id) => id !== catId)
                            )
                          }
                          className="ml-1 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 rounded p-0.5 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                  <button
                    onClick={() => handleCategoryChange([])}
                    className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Grid de productos con loading state mejorado */}
        {showLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
              {LOADING}
            </p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
            {products.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-300">
            <Package className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
              No hay productos disponibles
            </p>
          </div>
        )}

        {/* Paginación mejorada con navegación inteligente */}
        {!showLoading && products.length > 0 && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 gap-2 flex-wrap">
            {/* Botón Anterior */}
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-750 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
              {PREV}
            </button>

            <div className="flex gap-1 items-center">
              {pagination.totalPages <= 6 ? (
                // Si hay 6 páginas o menos, mostrar todas
                Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition-all duration-200 
                      ${
                        p === page
                          ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-md"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                      }`}
                  >
                    {p}
                  </button>
                ))
              ) : (
                // Si hay más de 6 páginas, mostrar primeras 3, últimas 3 y navegación
                <>
                  {/* Primera página */}
                  <button
                    onClick={() => handlePageChange(1)}
                    className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition-all duration-200 
                      ${
                        1 === page
                          ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-md"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                      }`}
                  >
                    1
                  </button>

                  {/* Segunda página */}
                  {pagination.totalPages > 1 && (
                    <button
                      onClick={() => handlePageChange(2)}
                      className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition-all duration-200 
                        ${
                          2 === page
                            ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-md"
                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                        }`}
                    >
                      2
                    </button>
                  )}

                  {/* Tercera página */}
                  {pagination.totalPages > 2 && (
                    <button
                      onClick={() => handlePageChange(3)}
                      className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition-all duration-200 
                        ${
                          3 === page
                            ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-md"
                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                        }`}
                    >
                      3
                    </button>
                  )}

                  {/* Puntos suspensivos y página actual si está en el medio */}
                  {page > 3 && page < pagination.totalPages - 2 && (
                    <>
                      <span className="px-2 text-gray-500 dark:text-gray-400">
                        ...
                      </span>
                      <button className="min-w-[40px] h-10 px-3 rounded-lg font-medium transition-all duration-200 bg-indigo-600 dark:bg-indigo-500 text-white shadow-md">
                        {page}
                      </button>
                    </>
                  )}

                  {/* Puntos suspensivos antes de las últimas páginas */}
                  <span className="px-2 text-gray-500 dark:text-gray-400">
                    ...
                  </span>

                  {/* Antepenúltima página */}
                  {pagination.totalPages > 2 && (
                    <button
                      onClick={() =>
                        handlePageChange(pagination.totalPages - 2)
                      }
                      className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition-all duration-200 
                        ${
                          pagination.totalPages - 2 === page
                            ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-md"
                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                        }`}
                    >
                      {pagination.totalPages - 2}
                    </button>
                  )}

                  {/* Penúltima página */}
                  {pagination.totalPages > 1 && (
                    <button
                      onClick={() =>
                        handlePageChange(pagination.totalPages - 1)
                      }
                      className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition-all duration-200 
                        ${
                          pagination.totalPages - 1 === page
                            ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-md"
                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                        }`}
                    >
                      {pagination.totalPages - 1}
                    </button>
                  )}

                  {/* Última página */}
                  <button
                    onClick={() => handlePageChange(pagination.totalPages)}
                    className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition-all duration-200 
                      ${
                        pagination.totalPages === page
                          ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-md"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                      }`}
                  >
                    {pagination.totalPages}
                  </button>
                </>
              )}
            </div>

            {/* Botón Siguiente */}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pagination.totalPages}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-750 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {NEXT}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
