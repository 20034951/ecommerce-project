import React, { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

const buttonVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center',
    'rounded-lg text-sm font-medium',
    'ring-offset-background transition-colors',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-95 transition-transform'
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-primary-600 text-white shadow',
          'hover:bg-primary-700',
          'focus:ring-primary-500'
        ],
        destructive: [
          'bg-red-600 text-white shadow-sm',
          'hover:bg-red-700',
          'focus:ring-red-500'
        ],
        outline: [
          'border border-input bg-background shadow-sm',
          'hover:bg-accent hover:text-accent-foreground',
          'focus:ring-primary-500'
        ],
        secondary: [
          'bg-secondary text-secondary-foreground shadow-sm',
          'hover:bg-secondary/80',
          'focus:ring-secondary-500'
        ],
        ghost: [
          'hover:bg-accent hover:text-accent-foreground',
          'focus:ring-primary-500'
        ],
        link: [
          'text-primary underline-offset-4',
          'hover:underline',
          'focus:ring-primary-500'
        ],
        gradient: [
          'bg-gradient-to-r from-primary-600 to-blue-600',
          'text-white shadow-lg',
          'hover:from-primary-700 hover:to-blue-700',
          'focus:ring-primary-500'
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