import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

/**
 * Componente Alert con soporte completo para modo oscuro
 * Sistema de alertas para mostrar mensajes informativos, advertencias y errores
 * @param {Object} props
 * @param {string} props.variant - Variante del alert: 'default', 'destructive', 'success', 'warning', 'info'
 * @param {string} props.className - Clases CSS adicionales
 */

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-100 dark:border-gray-800 [&>svg]:text-gray-600 dark:[&>svg]:text-gray-400',
        destructive: 'border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 bg-red-50 dark:bg-red-900/20 [&>svg]:text-red-600 dark:[&>svg]:text-red-400',
        success: 'border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 bg-green-50 dark:bg-green-900/20 [&>svg]:text-green-600 dark:[&>svg]:text-green-400',
        warning: 'border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-900/20 [&>svg]:text-amber-600 dark:[&>svg]:text-amber-400',
        info: 'border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/20 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight text-gray-900 dark:text-gray-100', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed text-gray-700 dark:text-gray-300', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

/**
 * Alert con icono predefinido según la variante
 */
const AlertWithIcon = React.forwardRef(({ className, variant = 'default', children, ...props }, ref) => {
  const icons = {
    default: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    ),
    destructive: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    success: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    info: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    )
  };

  return (
    <Alert ref={ref} variant={variant} className={className} {...props}>
      {icons[variant]}
      {children}
    </Alert>
  );
});
AlertWithIcon.displayName = 'AlertWithIcon';

/**
 * Alert con botón de cierre
 */
const DismissibleAlert = React.forwardRef(({ 
  className, 
  variant = 'default', 
  onDismiss, 
  children, 
  ...props 
}, ref) => {
  return (
    <Alert ref={ref} variant={variant} className={cn('pr-10', className)} {...props}>
      {children}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute right-3 top-3 rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
          aria-label="Cerrar alerta"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </Alert>
  );
});
DismissibleAlert.displayName = 'DismissibleAlert';

/**
 * Alert compacto para mensajes cortos
 */
const CompactAlert = React.forwardRef(({ className, variant = 'default', children, ...props }, ref) => (
  <Alert 
    ref={ref} 
    variant={variant} 
    className={cn('py-2 px-3 text-xs', className)} 
    {...props}
  >
    {children}
  </Alert>
));
CompactAlert.displayName = 'CompactAlert';

export { Alert, AlertTitle, AlertDescription, AlertWithIcon, DismissibleAlert, CompactAlert };