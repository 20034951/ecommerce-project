import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Label
} from '../../../components/ui';
import { Save, X } from 'lucide-react';

export function ShippingMethodForm({ isOpen, onClose, shippingMethod, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    region: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (shippingMethod) {
      setFormData({
        name: shippingMethod.name || '',
        cost: shippingMethod.cost?.toString() || '',
        region: shippingMethod.region || ''
      });
    } else {
      setFormData({
        name: '',
        cost: '',
        region: ''
      });
    }
    setErrors({});
  }, [shippingMethod, isOpen]);

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

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.cost || formData.cost.trim() === '') {
      newErrors.cost = 'El costo es requerido';
    } else if (isNaN(formData.cost) || parseFloat(formData.cost) < 0) {
      newErrors.cost = 'El costo debe ser un número válido mayor o igual a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      cost: parseFloat(formData.cost),
      region: formData.region.trim() || null
    };

    try {
      await onSubmit(submitData);
      handleClose();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', cost: '', region: '' });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white dark:bg-gray-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">
            {shippingMethod ? 'Editar Método de Envío' : 'Nuevo Método de Envío'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Nombre */}
          <div>
            <Label htmlFor="name" className="text-gray-900 dark:text-gray-100">
              Nombre <span className="text-red-600">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Envío Express"
              className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Costo */}
          <div>
            <Label htmlFor="cost" className="text-gray-900 dark:text-gray-100">
              Costo (Q.) <span className="text-red-600">*</span>
            </Label>
            <Input
              id="cost"
              name="cost"
              type="number"
              step="0.01"
              min="0"
              value={formData.cost}
              onChange={handleChange}
              placeholder="0.00"
              className={`mt-1 ${errors.cost ? 'border-red-500' : ''}`}
            />
            {errors.cost && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cost}</p>
            )}
          </div>

          {/* Región */}
          <div>
            <Label htmlFor="region" className="text-gray-900 dark:text-gray-100">
              Región (Opcional)
            </Label>
            <Input
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              placeholder="Ej: Ciudad de Guatemala"
              className="mt-1"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Especifica la región o área de cobertura
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
