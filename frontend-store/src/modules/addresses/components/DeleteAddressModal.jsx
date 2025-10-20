import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button
} from '../../../components/ui';
import { AlertTriangle } from 'lucide-react';

export default function DeleteAddressModal({ isOpen, onClose, onConfirm, address, isLoading }) {
  if (!address) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mr-3">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            Eliminar Dirección
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            ¿Estás seguro que deseas eliminar esta dirección? Esta acción no se puede deshacer.
          </p>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              {address.address_line}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {address.city}{address.state && `, ${address.state}`}
              {address.postal_code && ` - ${address.postal_code}`}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {address.country}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={onConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white shadow-sm hover:shadow transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span>Eliminando...</span>
                </div>
              ) : (
                <span>Eliminar</span>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
