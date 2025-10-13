import React, { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

/**
 * Componente Button con soporte completo para modo oscuro
 * Sistema de botones con múltiples variantes, tamaños y estados
 * @param {Object} props
 * @param {string} props.variant - Variante del botón: 'default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'gradient'
 * @param {string} props.size - Tamaño del botón: 'default', 'sm', 'lg', 'xl', 'icon'
 * @param {boolean} props.loading - Si está en estado de carga
 * @param {React.ReactNode} props.leftIcon - Icono a la izquierda
 * @param {React.ReactNode} props.rightIcon - Icono a la derecha
 * @param {boolean} props.asChild - Si debe renderizar como slot de Radix
 */

const buttonVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center',
    'rounded-lg text-sm font-medium',
    'ring-offset-white dark:ring-offset-gray-800 transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-95 transition-transform',
    'cursor-pointer'
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-blue-600 dark:bg-blue-500 text-white shadow',
          'hover:bg-blue-700 dark:hover:bg-blue-600',
          'focus-visible:ring-blue-500'
        ],
        destructive: [
          'bg-red-600 dark:bg-red-500 text-white shadow-sm',
          'hover:bg-red-700 dark:hover:bg-red-600',
          'focus-visible:ring-red-500'
        ],
        outline: [
          'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm',
          'text-gray-900 dark:text-gray-100',
          'hover:bg-gray-50 dark:hover:bg-gray-700',
          'focus-visible:ring-blue-500'
        ],
        secondary: [
          'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm',
          'hover:bg-gray-200 dark:hover:bg-gray-600',
          'focus-visible:ring-gray-500'
        ],
        ghost: [
          'text-gray-700 dark:text-gray-300',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          'focus-visible:ring-blue-500'
        ],
        link: [
          'text-blue-600 dark:text-blue-400 underline-offset-4',
          'hover:underline hover:text-blue-700 dark:hover:text-blue-300',
          'focus-visible:ring-blue-500'
        ],
        gradient: [
          'bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500',
          'text-white shadow-lg',
          'hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600',
          'focus-visible:ring-blue-500'
        ],
        success: [
          'bg-green-600 dark:bg-green-500 text-white shadow',
          'hover:bg-green-700 dark:hover:bg-green-600',
          'focus-visible:ring-green-500'
        ],
        warning: [
          'bg-amber-500 dark:bg-amber-600 text-white shadow',
          'hover:bg-amber-600 dark:hover:bg-amber-700',
          'focus-visible:ring-amber-500'
        ]
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        xl: 'h-12 rounded-lg px-10 text-base',
        icon: 'h-9 w-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

const Button = forwardRef(({ 
  className, 
  variant, 
  size, 
  asChild = false, 
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props 
}, ref) => {
  const Comp = asChild ? Slot : 'button';
  
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="mr-2 h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && leftIcon && (
        <span className="mr-2 flex-shrink-0">
          {leftIcon}
        </span>
      )}
      {children}
      {!loading && rightIcon && (
        <span className="ml-2 flex-shrink-0">
          {rightIcon}
        </span>
      )}
    </Comp>
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };