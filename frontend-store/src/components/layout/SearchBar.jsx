import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Package,
  TrendingUp,
  Clock,
  Loader2,
  ArrowRight,
} from "lucide-react";
import httpClient from "../../api/http.js";

const SearchBar = ({ className = "", onResultClick = () => {} }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);
  const loadingTimerRef = useRef(null);
  const navigate = useNavigate();

  // Cargar búsquedas recientes del localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (err) {
        console.error("Error cargando búsquedas recientes:", err);
      }
    }
  }, []);

  // Cerrar resultados al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Función de búsqueda con debounce
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = async (term) => {
    if (term.length < 2) return;

    setIsLoading(true);

    // Delay mínimo de 200ms antes de mostrar el loading
    loadingTimerRef.current = setTimeout(() => {
      setShowLoading(true);
    }, 200);

    try {
      // Usar httpClient en lugar de fetch directo
      const data = await httpClient.get(
        `/api/products/search?q=${encodeURIComponent(term)}`
      );

      // Limpiar el timer si la respuesta fue rápida
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }

      if (data.success) {
        setResults(data.data || []);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("Error buscando productos:", err);
      setResults([]);
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    } finally {
      setIsLoading(false);
      setShowLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowResults(true);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
    setShowLoading(false);
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
    }
  };

  const handleProductClick = (product) => {
    // Guardar en búsquedas recientes
    saveRecentSearch(product.name);

    // Navegar al producto
    navigate(`/products/${product.product_id}`);

    // Limpiar y cerrar
    setQuery("");
    setResults([]);
    setShowResults(false);
    onResultClick();
  };

  const handleRecentSearchClick = (searchTerm) => {
    setQuery(searchTerm);
    handleSearch(searchTerm);
  };

  const handleViewAllResults = () => {
    if (query.trim()) {
      // Guardar en búsquedas recientes
      saveRecentSearch(query);

      // Navegar al catálogo con el query de búsqueda
      navigate(`/catalog?q=${encodeURIComponent(query.trim())}`);

      // Limpiar y cerrar
      setShowResults(false);
      onResultClick();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim().length >= 2) {
      e.preventDefault();
      handleViewAllResults();
    }
  };

  const saveRecentSearch = (searchTerm) => {
    const updated = [
      searchTerm,
      ...recentSearches.filter((s) => s !== searchTerm),
    ].slice(0, 5); // Mantener solo las últimas 5

    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
    }).format(price);
  };

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      {/* Input de búsqueda */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>

        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowResults(true)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar productos..."
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
          aria-label="Buscar productos"
        />

        {/* Botón de limpiar o loading */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {showLoading ? (
            <Loader2 className="h-5 w-5 text-indigo-500 dark:text-indigo-400 animate-spin" />
          ) : query.length > 0 ? (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-5 w-5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Panel de resultados */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
          {/* Búsquedas recientes */}
          {query.length < 2 && recentSearches.length > 0 && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Búsquedas recientes
                  </span>
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors duration-200"
                >
                  Limpiar
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Resultados de búsqueda */}
          {query.length >= 2 && (
            <>
              {showLoading ? (
                <div className="p-8 text-center animate-in fade-in duration-200">
                  <Loader2 className="h-8 w-8 text-indigo-500 dark:text-indigo-400 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Buscando productos...
                  </p>
                </div>
              ) : results.length > 0 ? (
                <div className="animate-in fade-in duration-300">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          {results.length}{" "}
                          {results.length === 1 ? "Resultado" : "Resultados"}
                        </span>
                      </div>
                      <button
                        onClick={handleViewAllResults}
                        className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200"
                      >
                        Ver todos
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="py-2">
                    {results.map((product) => (
                      <button
                        key={product.product_id}
                        onClick={() => handleProductClick(product)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        {/* Imagen del producto */}
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                          {product.image_path ? (
                            <img
                              src={product.image_path}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                          )}
                        </div>

                        {/* Información del producto */}
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {product.category?.name || "Sin categoría"}
                            </span>
                            {product.stock > 0 ? (
                              <span className="text-xs text-emerald-600 dark:text-emerald-400">
                                • En stock
                              </span>
                            ) : (
                              <span className="text-xs text-red-600 dark:text-red-400">
                                • Agotado
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Precio */}
                        <div className="flex-shrink-0">
                          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Botón "Ver todos los resultados" al final */}
                  <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleViewAllResults}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg font-medium text-sm transition-colors duration-200"
                    >
                      Ver todos los resultados
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center animate-in fade-in duration-300">
                  <Package className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    No se encontraron productos
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Intenta con otros términos de búsqueda
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
