import React from 'react';
import { cn } from '../../utils/cn.js';

/**
 * Componente Badge con soporte completo para modo oscuro
 * Badges para mostrar estados, categorías y información contextual
 * @param {Object} props
 * @param {string} props.variant - Variante del badge: 'default', 'secondary', 'destructive', 'outline', 'success', 'warning', 'info'
 * @param {string} props.size - Tamaño del badge: 'sm', 'default', 'lg'
 * @param {string} props.className - Clases CSS adicionales
 */

const Badge = React.forwardRef(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const variants = {
    default: 'border-transparent bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50',
    secondary: 'border-transparent bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600',
    destructive: 'border-transparent bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50',
    error: 'border-transparent bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50',
    outline: 'border-gray-300 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
    success: 'border-transparent bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50',
    warning: 'border-transparent bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50',
    info: 'border-transparent bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 hover:bg-cyan-200 dark:hover:bg-cyan-900/50',
    purple: 'border-transparent bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50',
    pink: 'border-transparent bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-900/50'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    default: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-md border font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800',
        variants[variant] || variants.default,
        sizes[size],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = 'Badge';

/**
 * Badge de estado con punto indicador
 */
const StatusBadge = React.forwardRef(({ className, variant = 'default', children, showDot = true, ...props }, ref) => {
  const dotColors = {
    default: 'bg-blue-500',
    secondary: 'bg-gray-500',
    destructive: 'bg-red-500',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    info: 'bg-cyan-500'
  };

  return (
    <Badge ref={ref} variant={variant} className={cn('flex items-center gap-1.5', className)} {...props}>
      {showDot && (
        <div className={cn('w-2 h-2 rounded-full', dotColors[variant] || dotColors.default)} />
      )}
      {children}
    </Badge>
  );
});
StatusBadge.displayName = 'StatusBadge';

/**
 * Badge con contador numérico
 */
const CountBadge = React.forwardRef(({ className, count, max = 99, variant = 'destructive', ...props }, ref) => {
  const displayCount = count > max ? `${max}+` : count.toString();
  
  return (
    <Badge 
      ref={ref} 
      variant={variant} 
      size="sm"
      className={cn('min-w-[1.25rem] h-5 px-1 justify-center', className)} 
      {...props}
    >
      {displayCount}
    </Badge>
  );
});
CountBadge.displayName = 'CountBadge';

/**
 * Badge con icono
 */
const IconBadge = React.forwardRef(({ className, icon, children, variant = 'default', ...props }, ref) => {
  return (
    <Badge ref={ref} variant={variant} className={cn('flex items-center gap-1', className)} {...props}>
      {icon && <span className="w-3 h-3">{icon}</span>}
      {children}
    </Badge>
  );
});
IconBadge.displayName = 'IconBadge';

export { Badge, StatusBadge, CountBadge, IconBadge };