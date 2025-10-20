import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button
} from '../../../components/ui';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export function DeleteConfirmModal({ isOpen, onClose, shippingMethod, onConfirm, isLoading }) {
  const handleConfirm = async () => {
    try {
      await onConfirm(shippingMethod.shipping_method_id);
      onClose();
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Confirmar Eliminación
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <p className="text-gray-700 dark:text-gray-300">
            ¿Estás seguro de que deseas eliminar el método de envío{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              "{shippingMethod?.name}"
            </span>
            ?
          </p>
          
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Advertencia:</strong> Si este método está asociado a pedidos existentes, no podrá ser eliminado.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isLoading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
