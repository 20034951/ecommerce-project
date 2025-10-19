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

export function UpdateOrderStatusForm({ orderId, currentStatus, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    status: currentStatus || 'pending',
    trackingNumber: '',
    trackingUrl: '',
    estimatedDelivery: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

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
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white flex items-center">
          <Package className="h-5 w-5 mr-2" />
          Actualizar Estado del Pedido
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Estado */}
          <div>
            <Label htmlFor="status" className="text-gray-900 dark:text-white">
              Estado <span className="text-red-500">*</span>
            </Label>
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1"
            >
              {STATUS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Número de Seguimiento */}
          <div>
            <Label htmlFor="trackingNumber" className="text-gray-900 dark:text-white">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Número de Seguimiento
                {['shipped', 'delivered'].includes(formData.status) && (
                  <span className="text-red-500">*</span>
                )}
              </div>
            </Label>
            <Input
              id="trackingNumber"
              name="trackingNumber"
              value={formData.trackingNumber}
              onChange={handleChange}
              placeholder="Ej: ABC123456789"
              className={`mt-1 ${errors.trackingNumber ? 'border-red-500' : ''}`}
            />
            {errors.trackingNumber && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.trackingNumber}
              </p>
            )}
          </div>

          {/* URL de Seguimiento */}
          <div>
            <Label htmlFor="trackingUrl" className="text-gray-900 dark:text-white">
              URL de Seguimiento
            </Label>
            <Input
              id="trackingUrl"
              name="trackingUrl"
              type="url"
              value={formData.trackingUrl}
              onChange={handleChange}
              placeholder="https://ejemplo.com/tracking"
              className="mt-1"
            />
          </div>

          {/* Fecha Estimada de Entrega */}
          {formData.status === 'shipped' && (
            <div>
              <Label htmlFor="estimatedDelivery" className="text-gray-900 dark:text-white">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha Estimada de Entrega
                  <span className="text-red-500">*</span>
                </div>
              </Label>
              <Input
                id="estimatedDelivery"
                name="estimatedDelivery"
                type="date"
                value={formData.estimatedDelivery}
                onChange={handleChange}
                className={`mt-1 ${errors.estimatedDelivery ? 'border-red-500' : ''}`}
              />
              {errors.estimatedDelivery && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.estimatedDelivery}
                </p>
              )}
            </div>
          )}

          {/* Notas */}
          <div>
            <Label htmlFor="notes" className="text-gray-900 dark:text-white">
              Notas Administrativas
            </Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Agregar notas sobre el cambio de estado..."
              rows={3}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Las notas serán visibles en el historial de cambios
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Actualizando...' : 'Actualizar Estado'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
