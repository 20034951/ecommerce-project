import React from 'react';
import { Button } from './Button.jsx';

/**
 * Componente ConfirmationModal con soporte completo para modo oscuro
 * Modal de confirmación reutilizable con diferentes tipos de iconos y acciones
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Function} props.onConfirm - Función para confirmar la acción
 * @param {string} props.title - Título del modal
 * @param {string} props.message - Mensaje del modal
 * @param {string} props.confirmText - Texto del botón de confirmación
 * @param {string} props.cancelText - Texto del botón de cancelación
 * @param {string} props.type - Tipo de modal: 'question', 'warning', 'danger', 'info', 'success'
 * @param {boolean} props.loading - Si está cargando la acción
 */

const iconTypes = {
  question: (
    <svg className="w-16 h-16 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-16 h-16 text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  danger: (
    <svg className="w-16 h-16 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  error: (
    <svg className="w-16 h-16 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  info: (
    <svg className="w-16 h-16 text-blue-500 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  success: (
    <svg className="w-16 h-16 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

const buttonColors = {
  question: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:ring-blue-500',
  warning: 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 focus:ring-amber-500',
  danger: 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 focus:ring-red-500',
  error: 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 focus:ring-red-500',
  info: 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500 focus:ring-blue-500',
  success: 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 focus:ring-green-500'
};

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Estás seguro?',
  message = '¿Deseas continuar con esta acción?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'question',
  loading = false,
  showCancelButton = true
}) {
  // Manejar tecla Escape
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-900/50 max-w-md w-full mx-auto transform transition-all duration-300 scale-100 border border-gray-100 dark:border-gray-800">
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="flex-shrink-0">
              {iconTypes[type]}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
            {title}
          </h3>

          {/* Message */}
          <div className="mb-8">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {message}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {(showCancelButton && type !== 'error') && (
              <Button
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-2 min-w-[100px] border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
              >
                {cancelText}
              </Button>
            )}
            <Button
              onClick={type === 'error' ? onClose : handleConfirm}
              disabled={loading}
              className={`px-6 py-2 min-w-[100px] text-white transition-all duration-200 focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${buttonColors[type]} ${loading ? 'opacity-75 cursor-not-allowed' : 'transform hover:scale-105'}`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </div>
              ) : (
                type === 'error' ? 'Aceptar' : confirmText
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}