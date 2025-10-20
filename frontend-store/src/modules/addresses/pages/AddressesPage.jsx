import React, { useState, useEffect } from 'react';
import ProfileLayout from '../../../layouts/ProfileLayout.jsx';
import { Card, CardContent, Alert, AlertDescription } from '../../../components/ui';
import { MapPin, Plus, Loader2, AlertCircle } from 'lucide-react';
import { addressesApi } from '../../../api';
import { AddressCard, AddressFormModal, DeleteAddressModal } from '../components';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Cargar direcciones
  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await addressesApi.getAll();
      // El API retorna { success, data }, extraemos el array de data
      setAddresses(Array.isArray(response) ? response : (response.data || []));
    } catch (err) {
      setError(err.message || 'Error al cargar las direcciones');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Manejar creación/edición
  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (selectedAddress) {
        // Editar
        await addressesApi.update(selectedAddress.address_id, data);
        setSuccessMessage('Dirección actualizada exitosamente');
      } else {
        // Crear
        await addressesApi.create(data);
        setSuccessMessage('Dirección agregada exitosamente');
      }

      setIsFormModalOpen(false);
      setSelectedAddress(null);
      await fetchAddresses();

      // Ocultar mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Error al guardar la dirección');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar eliminación
  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      await addressesApi.delete(selectedAddress.address_id);
      setSuccessMessage('Dirección eliminada exitosamente');
      setIsDeleteModalOpen(false);
      setSelectedAddress(null);
      await fetchAddresses();

      // Ocultar mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Error al eliminar la dirección');
      setIsDeleteModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Abrir modal de edición
  const handleEdit = (address) => {
    setSelectedAddress(address);
    setIsFormModalOpen(true);
  };

  // Abrir modal de eliminación
  const handleDeleteClick = (address) => {
    setSelectedAddress(address);
    setIsDeleteModalOpen(true);
  };

  // Abrir modal de creación
  const handleAdd = () => {
    setSelectedAddress(null);
    setIsFormModalOpen(true);
  };

  // Cerrar modales
  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedAddress(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedAddress(null);
  };

  return (
    <ProfileLayout>
      {/* Mensajes */}
      {successMessage && (
        <Alert className="mb-4 sm:mb-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-800/30 rounded-lg flex items-center justify-center mr-3">
              <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <AlertDescription className="text-emerald-800 dark:text-emerald-200 flex-1 text-sm sm:text-base">
              {successMessage}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4 sm:mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-800/30 rounded-lg flex items-center justify-center mr-3">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <AlertDescription className="text-red-800 dark:text-red-200 flex-1 text-sm sm:text-base">
              {error}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Header con botón */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Mis Direcciones
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Administra tus direcciones de envío y facturación
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg font-medium shadow-sm hover:shadow transition-all"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
          <span className="hidden sm:inline">Agregar</span>
        </button>
      </div>

      {/* Contenido */}
      {isLoading ? (
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <Loader2 className="h-12 w-12 text-indigo-600 dark:text-indigo-400 animate-spin mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Cargando direcciones...</p>
            </div>
          </CardContent>
        </Card>
      ) : addresses.length === 0 ? (
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardContent className="p-8 sm:p-12">
            <div className="text-center max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 dark:bg-amber-900/20 rounded-2xl mb-4 sm:mb-6">
                <MapPin className="h-8 w-8 sm:h-10 sm:w-10 text-amber-600 dark:text-amber-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No hay direcciones guardadas
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
                Agrega tus direcciones de envío para realizar pedidos más rápido y llevar control de tus entregas
              </p>
              <button
                onClick={handleAdd}
                className="inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg font-medium shadow-sm hover:shadow transition-all"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span>Agregar Dirección</span>
              </button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {addresses.map((address) => (
            <AddressCard
              key={address.address_id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Modales */}
      <AddressFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleSubmit}
        address={selectedAddress}
        isLoading={isSubmitting}
      />

      <DeleteAddressModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        address={selectedAddress}
        isLoading={isSubmitting}
      />
    </ProfileLayout>
  );
}