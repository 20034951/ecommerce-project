import { useState } from 'react';

export const useConfirmation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState({
    title: '¿Estás seguro?',
    message: '¿Deseas continuar con esta acción?',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    type: 'question',
    onConfirm: null
  });
  const [loading, setLoading] = useState(false);

  const showConfirmation = (options = {}) => {
    setConfirmationData({
      title: options.title || '¿Estás seguro?',
      message: options.message || '¿Deseas continuar con esta acción?',
      confirmText: options.confirmText || 'Confirmar',
      cancelText: options.cancelText || 'Cancelar',
      type: options.type || 'question',
      onConfirm: options.onConfirm || null
    });
    setIsOpen(true);
  };

  const hideConfirmation = () => {
    setIsOpen(false);
    setLoading(false);
  };

  const handleConfirm = async () => {
    if (confirmationData.onConfirm) {
      try {
        setLoading(true);
        await confirmationData.onConfirm();
        hideConfirmation();
      } catch (error) {
        console.error('Error in confirmation handler:', error);
        setLoading(false);
        // No cerrar el modal si hay error, para que el usuario pueda ver el error
      }
    } else {
      hideConfirmation();
    }
  };

  return {
    isOpen,
    confirmationData,
    loading,
    showConfirmation,
    hideConfirmation,
    handleConfirm
  };
};