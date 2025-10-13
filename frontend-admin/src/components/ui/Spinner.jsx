import React from 'react';
import { cn } from '../../utils/cn.js';

/**
 * Componente Spinner con soporte para modo oscuro
 * @param {Object} props
 * @param {string} props.size - Tamaño del spinner: 'sm', 'md', 'lg', 'xl'
 * @param {string} props.variant - Variante de color: 'default', 'primary', 'success', 'warning', 'danger', 'white', 'current'
 * @param {string} props.className - Clases CSS adicionales
 */
const Spinner = React.forwardRef(({ className, size = 'md', variant = 'default', ...props }, ref) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const variants = {
    default: 'text-gray-600 dark:text-gray-400',
    primary: 'text-blue-600 dark:text-blue-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-amber-600 dark:text-amber-400',
    danger: 'text-red-600 dark:text-red-400',
    white: 'text-white',
    current: 'text-current'
  };

  return (
    <div
      ref={ref}
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
});
Spinner.displayName = 'Spinner';

export { Spinner };