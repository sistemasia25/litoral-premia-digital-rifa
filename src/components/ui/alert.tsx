
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"

// Tipos de variantes de alerta
type AlertVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info'

// Mapeamento de ícones para cada variante
const alertIcons = {
  default: Info,
  destructive: XCircle,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
}

// Mapeamento de cores para cada variante
const alertVariants = cva(
  [
    "relative w-full rounded-lg border p-4",
    "[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px]",
    "[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:h-5 [&>svg]:w-5"
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-background text-foreground border-border/50",
          "[&>svg]:text-foreground"
        ],
        destructive: [
          "bg-destructive/10 border-destructive/30 text-destructive",
          "dark:bg-destructive/20 dark:border-destructive/40",
          "[&>svg]:text-destructive"
        ],
        success: [
          "bg-emerald-50 border-emerald-200 text-emerald-800",
          "dark:bg-emerald-950/30 dark:border-emerald-800/30 dark:text-emerald-200",
          "[&>svg]:text-emerald-600 dark:[&>svg]:text-emerald-400"
        ],
        warning: [
          "bg-amber-50 border-amber-200 text-amber-800",
          "dark:bg-amber-950/30 dark:border-amber-800/30 dark:text-amber-200",
          "[&>svg]:text-amber-600 dark:[&>svg]:text-amber-400"
        ],
        info: [
          "bg-blue-50 border-blue-200 text-blue-800",
          "dark:bg-blue-950/30 dark:border-blue-800/30 dark:text-blue-200",
          "[&>svg]:text-blue-600 dark:[&>svg]:text-blue-400"
        ]
      },
      size: {
        sm: "text-sm p-3 [&>svg]:h-4 [&>svg]:w-4",
        default: "text-base p-4",
        lg: "text-lg p-5 [&>svg]:h-6 [&>svg]:w-6"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface AlertProps 
  extends React.HTMLAttributes<HTMLDivElement>, 
    VariantProps<typeof alertVariants> {
  onClose?: () => void
  showIcon?: boolean
  closable?: boolean
  icon?: React.ReactNode
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({
    className, 
    variant = 'default',
    size,
    onClose,
    showIcon = true,
    closable = false,
    icon: customIcon,
    children,
    ...props 
  }, ref) => {
    const IconComponent = customIcon || alertIcons[variant as AlertVariant] || alertIcons.default
    const hasClose = closable && onClose
    
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          alertVariants({ 
            variant: variant as AlertVariant, 
            size,
            className 
          }),
          hasClose && "pr-12"
        )}
        {...props}
      >
        {showIcon && typeof IconComponent === 'function' && (
          <IconComponent className={cn(
            "h-5 w-5",
            size === 'sm' && "h-4 w-4",
            size === 'lg' && "h-6 w-6"
          )} />
        )}
        
        <div className={cn(
          "flex-1",
          showIcon && "pl-7"
        )}>
          {children}
        </div>
        
        {hasClose && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-2 top-2 h-6 w-6 p-0.5 rounded-full opacity-70 hover:bg-foreground/10 hover:opacity-100"
            aria-label="Fechar alerta"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    )
  }
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span'
  }
>(({ 
  className, 
  as: Component = 'h5',
  ...props 
}, ref) => {
  const baseStyles = "font-semibold leading-tight tracking-tight"
  
  return (
    <Component
      ref={ref}
      className={cn(baseStyles, className)}
      {...props}
    />
  )
})
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-sm [&_p]:leading-relaxed mt-1.5",
      "[&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:opacity-80",
      className
    )}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { 
  Alert, 
  AlertTitle, 
  AlertDescription,
  type AlertVariant,
  type AlertProps 
}
