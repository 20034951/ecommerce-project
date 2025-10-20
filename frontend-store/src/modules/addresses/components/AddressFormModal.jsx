import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Label
} from '../../../components/ui';
import { MapPin, Building2, Globe, Mail as MailIcon } from 'lucide-react';

const addressSchema = z.object({
  address_line: z.string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(255, 'La dirección no puede exceder 255 caracteres'),
  city: z.string()
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(100, 'La ciudad no puede exceder 100 caracteres'),
  state: z.string()
    .max(100, 'El departamento no puede exceder 100 caracteres')
    .optional(),
  country: z.string()
    .min(2, 'El país debe tener al menos 2 caracteres')
    .max(100, 'El país no puede exceder 100 caracteres'),
  postal_code: z.string()
    .max(20, 'El código postal no puede exceder 20 caracteres')
    .optional(),
  type: z.enum(['shipping', 'billing'], {
    required_error: 'El tipo de dirección es requerido'
  })
});

const defaultFormValues = {
  address_line: '',
  city: '',
  state: '',
  country: 'Guatemala',
  postal_code: '',
  type: 'shipping'
};

export default function AddressFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  address = null, 
  isLoading = false 
}) {
  const isEditing = !!address;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: defaultFormValues
  });

  // Actualizar el formulario cuando cambia la dirección
  useEffect(() => {
    if (isOpen) {
      if (address) {
        // Si hay una dirección, cargar sus datos
        reset({
          address_line: address.address_line || '',
          city: address.city || '',
          state: address.state || '',
          country: address.country || 'Guatemala',
          postal_code: address.postal_code || '',
          type: address.type || 'shipping'
        });
      } else {
        // Si no hay dirección, usar valores por defecto
        reset(defaultFormValues);
      }
    }
  }, [isOpen, address, reset]);

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    // No resetear aquí, se hace al cerrar o al abrir de nuevo
  };

  const handleClose = () => {
    reset(defaultFormValues);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mr-3">
              <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            {isEditing ? 'Editar Dirección' : 'Nueva Dirección'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 sm:space-y-5 mt-4">
          {/* Tipo de Dirección */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-gray-700 dark:text-gray-300 font-medium flex items-center">
              <Building2 className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
              Tipo de Dirección
            </Label>
            <select
              {...register('type')}
              id="type"
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition-all"
              disabled={isLoading}
            >
              <option value="shipping">Envío</option>
              <option value="billing">Facturación</option>
            </select>
            {errors.type && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                {errors.type.message}
              </p>
            )}
          </div>

          {/* Dirección */}
          <div className="space-y-2">
            <Label htmlFor="address_line" className="text-gray-700 dark:text-gray-300 font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
              Dirección Completa
            </Label>
            <Input
              {...register('address_line')}
              id="address_line"
              type="text"
              placeholder="Calle, número, colonia, referencias..."
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-indigo-500 dark:focus:border-indigo-400"
              disabled={isLoading}
            />
            {errors.address_line && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                {errors.address_line.message}
              </p>
            )}
          </div>

          {/* Ciudad y Departamento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-gray-700 dark:text-gray-300 font-medium">
                Ciudad/Municipio
              </Label>
              <Input
                {...register('city')}
                id="city"
                type="text"
                placeholder="Ej: Guatemala"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400"
                disabled={isLoading}
              />
              {errors.city && (
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-gray-700 dark:text-gray-300 font-medium">
                Departamento
              </Label>
              <Input
                {...register('state')}
                id="state"
                type="text"
                placeholder="Ej: Guatemala"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400"
                disabled={isLoading}
              />
              {errors.state && (
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                  {errors.state.message}
                </p>
              )}
            </div>
          </div>

          {/* País y Código Postal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country" className="text-gray-700 dark:text-gray-300 font-medium flex items-center">
                <Globe className="h-4 w-4 mr-2 text-teal-600 dark:text-teal-400" />
                País
              </Label>
              <Input
                {...register('country')}
                id="country"
                type="text"
                placeholder="Ej: Guatemala"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-teal-500 dark:focus:border-teal-400"
                disabled={isLoading}
              />
              {errors.country && (
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                  {errors.country.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="postal_code" className="text-gray-700 dark:text-gray-300 font-medium flex items-center">
                <MailIcon className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                Código Postal
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-normal">(Opcional)</span>
              </Label>
              <Input
                {...register('postal_code')}
                id="postal_code"
                type="text"
                placeholder="Ej: 01001"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-gray-500 dark:focus:border-gray-400"
                disabled={isLoading}
              />
              {errors.postal_code && (
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                  {errors.postal_code.message}
                </p>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-sm hover:shadow transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span>{isEditing ? 'Actualizando...' : 'Guardando...'}</span>
                </div>
              ) : (
                <span>{isEditing ? 'Actualizar Dirección' : 'Guardar Dirección'}</span>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
