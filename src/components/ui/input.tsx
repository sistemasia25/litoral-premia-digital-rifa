import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'filled' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: boolean
  errorMessage?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type = 'text',
    variant = 'default',
    size = 'default',
    leftIcon,
    rightIcon,
    error = false,
    errorMessage,
    ...props
  }, ref) => {
    const variantClasses = {
      default: 'bg-background border-input',
      filled: 'bg-accent/10 border-accent/20',
      outline: 'bg-transparent border-2 border-border/50',
      ghost: 'bg-transparent border-0 border-b-2 border-border/30 hover:border-primary/50',
    }

    const sizeClasses = {
      sm: 'h-8 px-2.5 text-sm',
      default: 'h-10 px-3 text-base',
      lg: 'h-12 px-4 text-lg',
    }

    const iconSizeClasses = {
      sm: 'h-3.5 w-3.5',
      default: 'h-4 w-4',
      lg: 'h-5 w-5',
    }

    const iconSpacing = {
      sm: 'pl-8',
      default: 'pl-10',
      lg: 'pl-11',
    }

    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ${iconSizeClasses[size]}`}>
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex w-full rounded-md bg-background text-foreground',
            'ring-offset-background transition-all duration-200',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground/60',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            variantClasses[variant],
            sizeClasses[size],
            leftIcon && iconSpacing[size],
            rightIcon && 'pr-10',
            error && 'border-destructive focus-visible:ring-destructive/50',
            className
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground ${iconSizeClasses[size]}`}>
            {rightIcon}
          </div>
        )}
        {error && errorMessage && (
          <p className="mt-1.5 text-xs text-destructive">
            {errorMessage}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
