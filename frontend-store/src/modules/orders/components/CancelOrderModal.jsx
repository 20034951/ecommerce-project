import React, { useState } from 'react';
import {
  Dialog,
  Button,
  Input,
  Label,
  Alert
} from '../../../components/ui';
import { AlertCircle, XCircle } from 'lucide-react';

export default function CancelOrderModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  orderId,
  orderStatus,
  isLoading = false
}) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  // Validar si el pedido puede ser cancelado
  const canBeCancelled = ['pending', 'paid', 'processing'].includes(orderStatus);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!reason.trim()) {
      setError('Por favor, proporciona una razón para la cancelación');
      return;
    }

    if (reason.trim().length < 10) {
      setError('La razón debe tener al menos 10 caracteres');
      return;
    }

    try {
      await onConfirm(reason.trim());
      setReason('');
      onClose();
    } catch (err) {
      setError(err.message || 'Error al cancelar el pedido');
    }
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  if (!canBeCancelled) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No se puede cancelar
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Este pedido no puede ser cancelado porque ya ha sido {
                  orderStatus === 'shipped' ? 'enviado' :
                  orderStatus === 'delivered' ? 'entregado' :
                  orderStatus === 'cancelled' ? 'cancelado' : 'procesado'
                }.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Si tienes algún problema con tu pedido, por favor contacta a nuestro servicio de atención al cliente.
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleClose}
              variant="outline"
              className="border-gray-300 dark:border-gray-600"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Cancelar Pedido #{orderId}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Esta acción no se puede deshacer. Por favor, indica el motivo de la cancelación.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="reason" className="text-gray-700 dark:text-gray-300">
              Motivo de cancelación *
            </Label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej: Encontré un mejor precio, cambié de opinión, etc."
              rows={4}
              disabled={isLoading}
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                       placeholder-gray-400 dark:placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                       disabled:opacity-50 disabled:cursor-not-allowed
                       resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Mínimo 10 caracteres
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </Alert>
          )}

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
            <p className="text-sm text-yellow-800 dark:text-yellow-400">
              <strong>Nota:</strong> Si ya realizaste el pago, el reembolso se procesará en 5-7 días hábiles.
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              disabled={isLoading}
              className="border-gray-300 dark:border-gray-600"
            >
              No, mantener pedido
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? 'Cancelando...' : 'Sí, cancelar pedido'}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
