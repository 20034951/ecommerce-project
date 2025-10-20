import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Truck, Package, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { Button, Input, Card } from '../../../components/ui';
import { ShippingMethodForm, DeleteConfirmModal } from '../components';
import { 
  useShippingMethods, 
  useCreateShippingMethod, 
  useUpdateShippingMethod, 
  useDeleteShippingMethod 
} from '../../../hooks/useShippingMethods';

export default function ShippingMethodsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [notification, setNotification] = useState(null);

  // React Query hooks
  const { data: shippingMethods = [], isLoading, error } = useShippingMethods();
  const createMutation = useCreateShippingMethod();
  const updateMutation = useUpdateShippingMethod();
  const deleteMutation = useDeleteShippingMethod();

  // Filtrado de métodos de envío
  const filteredMethods = useMemo(() => {
    if (!searchTerm.trim()) return shippingMethods;
    
    const term = searchTerm.toLowerCase();
    return shippingMethods.filter(method => 
      method.name.toLowerCase().includes(term) ||
      (method.region && method.region.toLowerCase().includes(term))
    );
  }, [shippingMethods, searchTerm]);

  // Auto-ocultar notificaciones después de 5 segundos
  React.useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Handlers
  const handleCreate = () => {
    setSelectedMethod(null);
    setIsFormOpen(true);
  };

  const handleEdit = (method) => {
    setSelectedMethod(method);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (method) => {
    setSelectedMethod(method);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedMethod) {
        await updateMutation.mutateAsync({
          id: selectedMethod.shipping_method_id,
          data
        });
        setNotification({ type: 'success', message: 'Método de envío actualizado correctamente' });
      } else {
        await createMutation.mutateAsync(data);
        setNotification({ type: 'success', message: 'Método de envío creado correctamente' });
      }
      setIsFormOpen(false);
    } catch (error) {
      const message = error.response?.data?.message || 'Error al guardar el método de envío';
      setNotification({ type: 'error', message });
      throw error; // Re-lanzar para que el formulario maneje el estado de loading
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      setNotification({ type: 'success', message: 'Método de envío eliminado correctamente' });
      setIsDeleteModalOpen(false);
    } catch (error) {
      const message = error.response?.data?.message || 'Error al eliminar el método de envío';
      setNotification({ type: 'error', message });
      throw error;
    }
  };

  const formatCurrency = (amount) => {
    return `Q. ${parseFloat(amount).toLocaleString('es-GT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando métodos de envío...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="text-red-600 dark:text-red-400 text-5xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Error al cargar los métodos de envío
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {error.response?.data?.message || error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 max-w-md animate-slide-in-right`}>
          <div className={`rounded-lg shadow-lg p-4 flex items-start gap-3 ${
            notification.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800' 
              : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                notification.type === 'success' 
                  ? 'text-emerald-900 dark:text-emerald-100' 
                  : 'text-red-900 dark:text-red-100'
              }`}>
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className={`flex-shrink-0 ${
                notification.type === 'success' 
                  ? 'text-emerald-600 hover:text-emerald-800 dark:text-emerald-400' 
                  : 'text-red-600 hover:text-red-800 dark:text-red-400'
              }`}
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
              <Truck className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            Métodos de Envío
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Gestiona las opciones de entrega disponibles
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Método
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por nombre o región..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Content */}
      {filteredMethods.length === 0 ? (
        <Card className="p-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
              <Truck className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No se encontraron resultados' : 'No hay métodos de envío'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza creando tu primer método de envío'
              }
            </p>
            {!searchTerm && (
              <Button
                onClick={handleCreate}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Método de Envío
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Card className="overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              {/* Header */}
              <div className="bg-teal-100 dark:bg-teal-900/30 px-6 py-4 border-b border-teal-200 dark:border-teal-800">
                <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-teal-900 dark:text-teal-100">
                  <div className="col-span-4">Método</div>
                  <div className="col-span-3">Región</div>
                  <div className="col-span-2">Costo</div>
                  <div className="col-span-3 text-right">Acciones</div>
                </div>
              </div>

              {/* Body */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMethods.map((method) => (
                  <div
                    key={method.shipping_method_id}
                    className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Nombre */}
                      <div className="col-span-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {method.name}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Región */}
                      <div className="col-span-3">
                        {method.region ? (
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{method.region}</span>
                          </div>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400 italic text-sm">
                            Sin especificar
                          </span>
                        )}
                      </div>

                      {/* Costo */}
                      <div className="col-span-2">
                        <div className="text-lg font-semibold text-teal-600 dark:text-teal-400">
                          {formatCurrency(method.cost)}
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="col-span-3 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(method)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(method)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredMethods.map((method) => (
              <Card
                key={method.shipping_method_id}
                className="p-4 bg-white dark:bg-gray-800 border-l-4 border-l-teal-500 border-gray-200 dark:border-gray-700"
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {method.name}
                        </h3>
                        {method.region && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{method.region}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Costo */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Costo:</span>
                    <span className="text-lg font-semibold text-teal-600 dark:text-teal-400">
                      {formatCurrency(method.cost)}
                    </span>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(method)}
                      className="flex-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(method)}
                      className="flex-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Modals */}
      <ShippingMethodForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        shippingMethod={selectedMethod}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        shippingMethod={selectedMethod}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
