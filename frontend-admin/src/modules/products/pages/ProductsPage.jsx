import React, { useState, useEffect } from 'react';
import { Package, Plus, RefreshCw, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import ProductsTable from '../components/ProductsTable.jsx';
import ProductFilters from '../components/ProductFilters.jsx';
import ProductFormModal from '../components/ProductFormModal.jsx';
import ProductDetailModal from '../components/ProductDetailModal.jsx';
import ConfirmationModal from '../../../components/ui/ConfirmationModal.jsx';
import { productsApi } from '../../../api/products.js';
import { Alert } from '../../../components/ui/Alert.jsx';
import { useConfirmation } from '../../../hooks/useConfirmation.js';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0
  });
  
  const [filters, setFilters] = useState({
    search: '',
    category_id: null,
    stockStatus: null,
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });

  const { 
    isOpen: isConfirmationOpen,
    confirmationData,
    loading: confirmationLoading,
    confirm,
    hideConfirmation,
    handleConfirm
  } = useConfirmation();

  useEffect(() => {
    loadProducts();
  }, [pagination.page, filters]);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      };

      // Agregar filtros opcionales
      if (filters.search) {
        params.name = filters.search; // El backend espera 'name' no 'search'
      }
      if (filters.category_id) {
        params.category_id = filters.category_id;
      }
      if (filters.stockStatus) {
        if (filters.stockStatus === 'out-of-stock') {
          params.stock = 0;
        } else if (filters.stockStatus === 'low-stock') {
          params.lowStock = true;
        } else if (filters.stockStatus === 'in-stock') {
          params.inStock = true;
        }
      }

      const response = await productsApi.getAll(params);
      
      console.log('Response completa:', response);
      
      // Manejar diferentes estructuras de respuesta
      let productsData = [];
      let paginationData = null;
      
      if (Array.isArray(response)) {
        // Si la respuesta es directamente un array
        productsData = response;
      } else if (response.items && Array.isArray(response.items)) {
        // Estructura del backend: { items, pagination }
        productsData = response.items;
        paginationData = response.pagination;
      } else if (response.rows && Array.isArray(response.rows)) {
        // Si tiene estructura { rows, count, paginator }
        productsData = response.rows;
        if (response.paginator) {
          paginationData = {
            totalPages: response.paginator.totalPages,
            totalItems: response.count || 0
          };
        }
      } else if (response.data && Array.isArray(response.data)) {
        // Si tiene estructura { data, pagination }
        productsData = response.data;
        if (response.pagination) {
          paginationData = response.pagination;
        }
      }
      
      setProducts(productsData);
      
      if (paginationData) {
        setPagination(prev => ({
          ...prev,
          totalPages: paginationData.totalPages,
          totalItems: paginationData.totalItems
        }));
      }
    } catch (err) {
      console.error('Error cargando productos:', err);
      setError('Error al cargar los productos. Por favor, intenta de nuevo.');
      toast.error('Error al cargar los productos');
      setProducts([]); // Asegurar que products sea un array vacío en caso de error
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset a primera página
  };

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setShowFormModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowFormModal(true);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleDeleteProduct = async (product) => {
    const confirmed = await confirm({
      title: '¿Eliminar producto?',
      message: `¿Estás seguro de que deseas eliminar "${product.name}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      await productsApi.delete(product.product_id);
      toast.success('Producto eliminado exitosamente');
      loadProducts();
    } catch (err) {
      console.error('Error eliminando producto:', err);
      
      // Extraer el mensaje de error del backend
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          'Error al eliminar el producto';
      
      // Mostrar modal de error en lugar de toast
      setErrorModal({
        isOpen: true,
        title: 'No se puede eliminar el producto',
        message: errorMessage
      });
    }
  };

  const handleSaveProduct = async (productData) => {
    setIsSaving(true);
    
    try {
      if (selectedProduct) {
        // Editar producto existente
        await productsApi.update(selectedProduct.product_id, productData);
        toast.success('Producto actualizado exitosamente');
      } else {
        // Crear nuevo producto
        await productsApi.create(productData);
        toast.success('Producto creado exitosamente');
      }
      
      setShowFormModal(false);
      setSelectedProduct(null);
      loadProducts();
    } catch (err) {
      console.error('Error guardando producto:', err);
      toast.error(err.response?.data?.message || 'Error al guardar el producto');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Package className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Productos</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona el catálogo completo de productos de tu tienda
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadProducts}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
          <button
            onClick={handleCreateProduct}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors duration-200 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Nuevo Producto
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

      {/* Filtros */}
      <ProductFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Stats */}
      {!isLoading && !error && (
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Package className="h-4 w-4" />
            <span>
              Mostrando <span className="font-semibold text-gray-900 dark:text-white">{products.length}</span> de{' '}
              <span className="font-semibold text-gray-900 dark:text-white">{pagination.totalItems}</span> productos
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Página <span className="font-semibold text-gray-900 dark:text-white">{pagination.page}</span> de{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{pagination.totalPages}</span>
          </div>
        </div>
      )}

      {/* Tabla de productos */}
      <ProductsTable
        products={products}
        isLoading={isLoading}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onView={handleViewProduct}
      />

      {/* Paginación */}
      {!isLoading && !error && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="flex items-center gap-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </button>
          
          <div className="flex items-center gap-1">
            {[...Array(pagination.totalPages)].map((_, index) => {
              const page = index + 1;
              // Mostrar solo páginas cercanas a la actual
              if (
                page === 1 ||
                page === pagination.totalPages ||
                (page >= pagination.page - 1 && page <= pagination.page + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                      page === pagination.page
                        ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                        : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (page === pagination.page - 2 || page === pagination.page + 2) {
                return <span key={page} className="px-2 text-gray-500">...</span>;
              }
              return null;
            })}
          </div>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="flex items-center gap-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Modales */}
      <ProductFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setSelectedProduct(null);
        }}
        onSave={handleSaveProduct}
        product={selectedProduct}
        isLoading={isSaving}
      />

      <ProductDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />

      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={hideConfirmation}
        onConfirm={handleConfirm}
        title={confirmationData.title}
        message={confirmationData.message}
        confirmText={confirmationData.confirmText}
        cancelText={confirmationData.cancelText}
        type={confirmationData.type}
        loading={confirmationLoading}
      />

      {/* Modal de error */}
      <ConfirmationModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, title: '', message: '' })}
        title={errorModal.title}
        message={errorModal.message}
        type="error"
      />
    </div>
  );
}