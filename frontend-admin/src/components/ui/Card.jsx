import React from 'react';
import { cn } from '../../utils/cn.js';

/**
 * Componente Card con soporte completo para modo oscuro
 * Sistema de tarjetas composable para mostrar contenido estructurado
 */

/**
 * Componente Card con soporte completo para modo oscuro
 * Sistema de tarjetas composable para mostrar contenido estructurado
 * @param {Object} props
 * @param {string} props.variant - Variante de la card: 'default', 'elevated', 'outline'
 * @param {string} props.className - Clases CSS adicionales
 */

const Card = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-100 dark:border-gray-800',
    elevated: 'rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg hover:shadow-xl dark:shadow-gray-900/25 border border-gray-100 dark:border-gray-800 transition-shadow duration-200',
    outline: 'rounded-xl bg-transparent text-gray-900 dark:text-gray-100 border-2 border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200',
    subtle: 'rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-800/50'
  };

  return (
    <div
      ref={ref}
      className={cn(variants[variant], className)}
      {...props}
    />
  );
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-gray-600 dark:text-gray-300', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';

/**
 * Separador para dividir secciones dentro de una Card
 */
const CardSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('h-px bg-gray-200 dark:bg-gray-700 mx-6', className)} {...props} />
));
CardSeparator.displayName = 'CardSeparator';

/**
 * Badge para mostrar estados o categorías en las Cards
 */
const CardBadge = React.forwardRef(({ className, variant = 'default', children, ...props }, ref) => {
  const variants = {
    default: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    primary: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
  };

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});
CardBadge.displayName = 'CardBadge';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardSeparator, CardBadge };