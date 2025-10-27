import React, { useState, useEffect } from "react";
import {
  Tag,
  Plus,
  RefreshCw,
  Search,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import CategoriesTable from "../components/CategoriesTable";
import CategoryFormModal from "../components/CategoryFormModal";
import CategoryDetailModal from "../components/CategoryDetailModal";
import CategoryStats from "../components/CategoryStats";
import { Alert } from "../../../components/ui/Alert";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categoriesApi";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    // Filtrar categorías
    if (searchTerm.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (cat.description &&
            cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCategories(filtered);
    }
    setCurrentPage(1); // Reset a primera página al filtrar
  }, [searchTerm, categories]);

  const loadCategories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllCategories();
      const data = Array.isArray(response) ? response : response.data || [];
      setCategories(data);
      setFilteredCategories(data);
    } catch (err) {
      console.error("Error cargando categorías:", err);
      setError("Error al cargar las categorías. Por favor, intenta de nuevo.");
      toast.error("Error al cargar las categorías");
      setCategories([]);
      setFilteredCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setShowFormModal(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowFormModal(true);
  };

  const handleViewCategory = (category) => {
    setSelectedCategory(category);
    setShowDetailModal(true);
  };

  const handleSaveCategory = async (categoryData) => {
    setIsSaving(true);

    try {
      if (selectedCategory) {
        // Editar categoría existente
        await updateCategory(selectedCategory.category_id, categoryData);
        toast.success("Categoría actualizada exitosamente");
      } else {
        // Crear nueva categoría
        await createCategory(categoryData);
        toast.success("Categoría creada exitosamente");
      }

      setShowFormModal(false);
      setSelectedCategory(null);
      loadCategories();
    } catch (err) {
      console.error("Error guardando categoría:", err);
      toast.error(
        err.response?.data?.message || "Error al guardar la categoría"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (category) => {
    console.log("handleDeleteCategory llamado con:", category);
    console.log("productCount:", category.productCount);
    console.log("¿productCount > 0?", category.productCount > 0);

    // Validar si tiene productos
    if (category.productCount > 0) {
      console.log("⚠️ Mostrando toast de error - tiene productos");
      toast.error(
        `No se puede eliminar esta categoría porque tiene ${category.productCount} producto(s) asignado(s). Por favor, reasigna o elimina los productos primero.`,
        {
          duration: 5000,
          icon: "⚠️",
        }
      );
      return;
    }

    console.log("✅ No tiene productos, mostrando confirmación");
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar la categoría "${category.name}"?`
    );

    console.log("Confirmación del usuario:", confirmed);

    if (!confirmed) return;

    try {
      await deleteCategory(category.category_id);
      toast.success("Categoría eliminada exitosamente");
      loadCategories();
    } catch (err) {
      console.error("Error eliminando categoría:", err);
      const errorMessage =
        err.response?.data?.message || "Error al eliminar la categoría";

      // Verificar si es un error de restricción de FK
      if (
        errorMessage.includes("foreign key") ||
        errorMessage.includes("constraint")
      ) {
        toast.error(
          "No se puede eliminar esta categoría porque tiene productos asignados.",
          { duration: 5000 }
        );
      } else {
        toast.error(errorMessage);
      }
    }
  };

  // Paginación
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Tag className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Categorías
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Organiza y gestiona las categorías de tu tienda
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadCategories}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
          <button
            onClick={handleCreateCategory}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors duration-200 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Nueva Categoría
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="error" className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </Alert>
      )}

      {/* Stats */}
      {!isLoading && !error && <CategoryStats categories={categories} />}

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar categorías por nombre o descripción..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
          />
        </div>
      </div>

      {/* Info de búsqueda */}
      {searchTerm && (
        <div className="flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400">
            <Search className="h-4 w-4" />
            <span>
              Se encontraron{" "}
              <span className="font-semibold">{filteredCategories.length}</span>{" "}
              categoría(s) para "{searchTerm}"
            </span>
          </div>
          <button
            onClick={() => setSearchTerm("")}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            Limpiar
          </button>
        </div>
      )}

      {/* Tabla */}
      <CategoriesTable
        categories={currentCategories}
        isLoading={isLoading}
        onEdit={handleEditCategory}
        onView={handleViewCategory}
        onDelete={handleDeleteCategory}
      />

      {/* Paginación */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {startIndex + 1} a{" "}
            {Math.min(endIndex, filteredCategories.length)} de{" "}
            {filteredCategories.length} categoría(s)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                        page === currentPage
                          ? "bg-indigo-600 dark:bg-indigo-500 text-white"
                          : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <span key={page} className="px-2 text-gray-500">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modales */}
      <CategoryFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setSelectedCategory(null);
        }}
        onSave={handleSaveCategory}
        category={selectedCategory}
        isLoading={isSaving}
      />

      <CategoryDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
      />
    </div>
  );
}
