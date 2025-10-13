import React, { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

/**
 * Componente Input con soporte para modo oscuro y múltiples variantes
 * @param {Object} props
 * @param {string} props.variant - Variante del input: 'default', 'error', 'success', 'warning'
 * @param {string} props.size - Tamaño del input: 'default', 'sm', 'lg'
 * @param {boolean} props.error - Si tiene error (fuerza la variante error)
 * @param {React.ReactNode} props.leftIcon - Icono a la izquierda
 * @param {React.ReactNode} props.rightIcon - Icono a la derecha
 * @param {string} props.className - Clases CSS adicionales
 */

const inputVariants = cva(
  [
    'flex w-full rounded-lg border',
    'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
    'px-3 py-2 text-sm',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
    'placeholder:text-gray-500 dark:placeholder:text-gray-400',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-800',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'transition-colors duration-200'
  ],
  {
    variants: {
      variant: {
        default: 'border-gray-300 dark:border-gray-600 focus-visible:ring-blue-500 focus-visible:border-blue-500',
        error: 'border-red-500 dark:border-red-400 focus-visible:ring-red-500 focus-visible:border-red-500',
        success: 'border-green-500 dark:border-green-400 focus-visible:ring-green-500 focus-visible:border-green-500',
        warning: 'border-amber-500 dark:border-amber-400 focus-visible:ring-amber-500 focus-visible:border-amber-500'
      },
      size: {
        default: 'h-9 px-3 py-2',
        sm: 'h-8 px-3 py-1 text-xs',
        lg: 'h-11 px-4 py-3'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

const Input = forwardRef(({ 
  className, 
  variant,
  size,
  type = 'text',
  error,
  leftIcon,
  rightIcon,
  ...props 
}, ref) => {
  const inputVariant = error ? 'error' : variant;
  
  const inputElement = (
    <input
      type={type}
      className={cn(
        inputVariants({ variant: inputVariant, size }),
        leftIcon && 'pl-10',
        rightIcon && 'pr-10',
        className
      )}
      ref={ref}
      {...props}
    />
  );

  if (leftIcon || rightIcon) {
    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {leftIcon}
          </div>
        )}
        {inputElement}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }

  return inputElement;
});

Input.displayName = 'Input';

export { Input, inputVariants };