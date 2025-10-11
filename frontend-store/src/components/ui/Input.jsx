import React, { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

const inputVariants = cva(
  [
    'flex w-full rounded-lg border border-input bg-background',
    'px-3 py-2 text-sm ring-offset-background',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'transition-colors'
  ],
  {
    variants: {
      variant: {
        default: 'border-gray-300 focus:border-primary-500',
        error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
        success: 'border-green-500 focus:border-green-500 focus:ring-green-500'
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
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        {inputElement}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
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