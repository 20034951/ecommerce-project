import { useState, useCallback } from 'react';

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
  const [resolver, setResolver] = useState(null);

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      setConfirmationData({
        title: options.title || '¿Estás seguro?',
        message: options.message || '¿Deseas continuar con esta acción?',
        confirmText: options.confirmText || 'Confirmar',
        cancelText: options.cancelText || 'Cancelar',
        type: options.type || 'question',
        onConfirm: options.onConfirm || null
      });
      setResolver(() => resolve);
      setIsOpen(true);
    });
  }, []);

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

  const hideConfirmation = useCallback(() => {
    setIsOpen(false);
    setLoading(false);
    if (resolver) {
      resolver(false);
      setResolver(null);
    }
  }, [resolver]);

  const handleConfirm = useCallback(async () => {
    if (confirmationData.onConfirm) {
      try {
        setLoading(true);
        await confirmationData.onConfirm();
        setIsOpen(false);
        setLoading(false);
        if (resolver) {
          resolver(true);
          setResolver(null);
        }
      } catch (error) {
        console.error('Error in confirmation handler:', error);
        setLoading(false);
      }
    } else {
      setIsOpen(false);
      if (resolver) {
        resolver(true);
        setResolver(null);
      }
    }
  }, [confirmationData, resolver]);

  return {
    isOpen,
    confirmationData,
    loading,
    confirm,
    showConfirmation,
    hideConfirmation,
    handleConfirm
  };
};