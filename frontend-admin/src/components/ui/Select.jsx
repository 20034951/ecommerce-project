import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const selectVariants = cva(
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-gray-300 dark:border-gray-600',
        error: 'border-red-500 dark:border-red-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Select = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <select
      className={cn(selectVariants({ variant, className }))}
      ref={ref}
      {...props}
    />
  );
});

Select.displayName = 'Select';

export { Select, selectVariants };
