import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Layers,
  Package,
  ChevronRight,
  Loader2,
  Grid3x3,
  Search,
  X,
} from "lucide-react";
import categoriesApi from "../../../api/categories";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
      setFilteredCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("No se pudieron cargar las categorías");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar categorías cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (category.description &&
            category.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/catalog?category_id=${categoryId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
              Cargando categorías...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
              <Grid3x3 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Categorías
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Explora nuestros productos por categoría
              </p>
            </div>
          </div>

          {/* Buscador */}
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar categorías..."
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors duration-200"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
            )}
          </div>

          {/* Contador de resultados */}
          {searchTerm && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Se encontraron{" "}
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {filteredCategories.length}
              </span>{" "}
              {filteredCategories.length === 1 ? "categoría" : "categorías"}
            </p>
          )}
        </div>

        {/* Grid de categorías */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <div
                key={category.category_id}
                onClick={() => handleCategoryClick(category.category_id)}
                className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-200 cursor-pointer transform hover:scale-[1.02]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors duration-200">
                    <Layers className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                      <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                        {category.productCount || 0}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                  {category.name}
                </h3>

                {category.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                    {category.description}
                  </p>
                )}

                {!category.description && (
                  <p className="text-gray-400 dark:text-gray-500 text-sm italic">
                    Sin descripción
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                    <Package className="w-4 h-4" />
                    <span>Ver productos</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <Layers className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
              {searchTerm
                ? "No se encontraron categorías"
                : "No hay categorías disponibles"}
            </p>
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors duration-200"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
