import React from 'react';
import { cn } from '../../utils/cn.js';

/**
 * Componente Skeleton con soporte para modo oscuro
 * Muestra un placeholder animado mientras se carga el contenido
 * @param {Object} props
 * @param {string} props.className - Clases CSS adicionales
 * @param {string} props.variant - Variante del skeleton: 'default', 'secondary', 'accent'
 */
const Skeleton = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-gray-200 dark:bg-gray-700',
    secondary: 'bg-gray-300 dark:bg-gray-600', 
    accent: 'bg-blue-100 dark:bg-blue-900/30'
  };

  return (
    <div
      ref={ref}
      className={cn(
        'animate-pulse rounded-md',
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Skeleton.displayName = 'Skeleton';

/**
 * Skeleton para texto - líneas de diferentes anchos
 */
const SkeletonText = React.forwardRef(({ className, lines = 1, ...props }, ref) => {
  if (lines === 1) {
    return <Skeleton ref={ref} className={cn('h-4 w-full', className)} {...props} />;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton 
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full', // Última línea más corta
            className
          )}
          {...props}
        />
      ))}
    </div>
  );
});
SkeletonText.displayName = 'SkeletonText';

/**
 * Skeleton circular para avatares
 */
const SkeletonAvatar = React.forwardRef(({ className, size = 'md', ...props }, ref) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <Skeleton 
      ref={ref} 
      className={cn('rounded-full', sizes[size], className)} 
      {...props} 
    />
  );
});
SkeletonAvatar.displayName = 'SkeletonAvatar';

/**
 * Skeleton para tarjetas con contenido estructurado
 */
const SkeletonCard = React.forwardRef(({ className, showAvatar = false, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('p-4 space-y-4', className)} {...props}>
      {showAvatar && (
        <div className="flex items-center space-x-3">
          <SkeletonAvatar size="md" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      )}
      <div className="space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <SkeletonText lines={3} />
        <div className="flex space-x-2 pt-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
});
SkeletonCard.displayName = 'SkeletonCard';

export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard };