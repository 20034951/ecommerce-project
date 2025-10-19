import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const textareaVariants = cva(
  'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
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

const Textarea = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <textarea
      className={cn(textareaVariants({ variant, className }))}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };
