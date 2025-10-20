import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Select,
  Textarea
} from '../../../components/ui';
import { 
  Package,
  Calendar,
  Truck,
  AlertCircle,
  Save
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'paid', label: 'Pagado' },
  { value: 'processing', label: 'Procesando' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' }
];

// Transiciones de estado válidas
const VALID_TRANSITIONS = {
  pending: ['paid', 'cancelled'],
  paid: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [], // Estado final
  cancelled: [] // Estado final
};

export function UpdateOrderStatusForm({ orderId, currentStatus, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    status: currentStatus || 'pending',
    trackingNumber: '',
    trackingUrl: '',
    estimatedDelivery: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  
  // Obtener las opciones de estado válidas según el estado actual
  const getAvailableStatuses = () => {
    const validNextStatuses = VALID_TRANSITIONS[currentStatus] || [];
    
    // Siempre mostrar el estado actual
    const availableOptions = [
      STATUS_OPTIONS.find(opt => opt.value === currentStatus)
    ];
    
    // Agregar estados válidos de transición
    validNextStatuses.forEach(statusValue => {
      const option = STATUS_OPTIONS.find(opt => opt.value === statusValue);
      if (option) {
        availableOptions.push(option);
      }
    });
    
    return availableOptions.filter(Boolean);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar que el estado sea diferente al actual
    if (formData.status === currentStatus) {
      newErrors.status = 'Debes seleccionar un estado diferente al actual';
    }

    // Validar tracking number si el estado es shipped o delivered
    if (['shipped', 'delivered'].includes(formData.status)) {
      if (!formData.trackingNumber?.trim()) {
        newErrors.trackingNumber = 'El número de seguimiento es requerido para este estado';
      }
    }

    // Validar fecha estimada si el estado es shipped
    if (formData.status === 'shipped' && !formData.estimatedDelivery) {
      newErrors.estimatedDelivery = 'La fecha estimada es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Preparar datos para enviar
    const submitData = {
      status: formData.status,
      notes: formData.notes
    };

    // Solo incluir campos opcionales si tienen valor
    if (formData.trackingNumber) {
      submitData.trackingNumber = formData.trackingNumber;
    }
    if (formData.trackingUrl) {
      submitData.trackingUrl = formData.trackingUrl;
    }
    if (formData.estimatedDelivery) {
      submitData.estimatedDelivery = formData.estimatedDelivery;
    }

    try {
      await onSubmit(submitData);
      // Resetear formulario
      setFormData({
        status: formData.status,
        trackingNumber: '',
        trackingUrl: '',
        estimatedDelivery: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
      <CardHeader className="bg-purple-600 dark:bg-purple-700 text-white border-b-2 border-purple-700 dark:border-purple-600">
        <CardTitle className="flex items-center gap-2">
          <div className="w-10 h-10 bg-purple-500 dark:bg-purple-800 rounded-lg flex items-center justify-center">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Actualizar Estado</h3>
            <p className="text-xs text-purple-100 dark:text-purple-200 font-normal">Gestión de estado del pedido</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Estado */}
          <div>
            <Label htmlFor="status" className="text-gray-900 dark:text-gray-100 font-medium">
              Estado <span className="text-red-600 dark:text-red-400">*</span>
            </Label>
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${errors.status ? 'border-red-500 dark:border-red-400' : ''}`}
            >
              {getAvailableStatuses().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                  {option.value === currentStatus ? ' (Actual)' : ''}
                </option>
              ))}
            </Select>
            {errors.status ? (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.status}
              </p>
            ) : (
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                Solo se muestran las transiciones válidas desde el estado actual
              </p>
            )}
          </div>

          {/* Número de Seguimiento */}
          <div>
            <Label htmlFor="trackingNumber" className="text-gray-900 dark:text-gray-100 font-medium">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Número de Seguimiento
                {['shipped', 'delivered'].includes(formData.status) && (
                  <span className="text-red-600 dark:text-red-400">*</span>
                )}
              </div>
            </Label>
            <Input
              id="trackingNumber"
              name="trackingNumber"
              value={formData.trackingNumber}
              onChange={handleChange}
              placeholder="Ej: ABC123456789"
              className={`mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${errors.trackingNumber ? 'border-red-500 dark:border-red-400' : ''}`}
            />
            {errors.trackingNumber && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.trackingNumber}
              </p>
            )}
          </div>

          {/* URL de Seguimiento */}
          <div>
            <Label htmlFor="trackingUrl" className="text-gray-900 dark:text-gray-100 font-medium">
              URL de Seguimiento
            </Label>
            <Input
              id="trackingUrl"
              name="trackingUrl"
              type="url"
              value={formData.trackingUrl}
              onChange={handleChange}
              placeholder="https://ejemplo.com/tracking"
              className="mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Fecha Estimada de Entrega */}
          {formData.status === 'shipped' && (
            <div>
              <Label htmlFor="estimatedDelivery" className="text-gray-900 dark:text-gray-100 font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Fecha Estimada de Entrega
                  <span className="text-red-600 dark:text-red-400">*</span>
                </div>
              </Label>
              <Input
                id="estimatedDelivery"
                name="estimatedDelivery"
                type="date"
                value={formData.estimatedDelivery}
                onChange={handleChange}
                className={`mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${errors.estimatedDelivery ? 'border-red-500 dark:border-red-400' : ''}`}
              />
              {errors.estimatedDelivery && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.estimatedDelivery}
                </p>
              )}
            </div>
          )}

          {/* Notas */}
          <div>
            <Label htmlFor="notes" className="text-gray-900 dark:text-gray-100 font-medium">
              Notas Administrativas
            </Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Agregar notas sobre el cambio de estado..."
              rows={3}
              className="mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Las notas serán visibles en el historial de cambios
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading || formData.status === currentStatus}
              className="flex-1 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Actualizando...' : 'Actualizar Estado'}
            </Button>
          </div>
          
          {/* Mensaje de ayuda cuando el estado es el mismo */}
          {formData.status === currentStatus && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-300">
                El pedido ya se encuentra en estado <strong>{STATUS_OPTIONS.find(opt => opt.value === currentStatus)?.label}</strong>. 
                Selecciona un estado diferente para actualizar.
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
