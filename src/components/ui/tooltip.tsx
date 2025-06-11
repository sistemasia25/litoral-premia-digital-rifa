import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cva, type VariantProps } from "class-variance-authority"
import { Info, AlertTriangle, HelpCircle, CheckCircle2, XCircle } from "lucide-react"

import { cn } from "@/lib/utils"

// Tipos de variantes de tooltip
type TooltipVariant = 'default' | 'info' | 'success' | 'warning' | 'error' | 'dark'

// Mapeamento de ícones para cada variante
const tooltipIcons = {
  default: Info,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  dark: HelpCircle
}

// Variantes de estilo do tooltip
const tooltipVariants = cva(
  [
    "z-50 overflow-hidden rounded-md px-3 py-2 text-sm shadow-lg",
    "animate-in fade-in-0 zoom-in-95",
    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
    "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-popover text-popover-foreground border border-border/50",
          "shadow-sm"
        ],
        info: [
          "bg-blue-50 text-blue-900 border border-blue-200",
          "dark:bg-blue-950/90 dark:text-blue-100 dark:border-blue-800/50"
        ],
        success: [
          "bg-emerald-50 text-emerald-900 border border-emerald-200",
          "dark:bg-emerald-950/90 dark:text-emerald-100 dark:border-emerald-800/50"
        ],
        warning: [
          "bg-amber-50 text-amber-900 border border-amber-200",
          "dark:bg-amber-950/90 dark:text-amber-100 dark:border-amber-800/50"
        ],
        error: [
          "bg-red-50 text-red-900 border border-red-200",
          "dark:bg-red-950/90 dark:text-red-100 dark:border-red-800/50"
        ],
        dark: [
          "bg-gray-900 text-gray-50 border border-gray-800",
          "dark:bg-gray-50 dark:text-gray-900 dark:border-gray-200"
        ]
      },
      size: {
        sm: "text-xs px-2 py-1",
        default: "text-sm px-3 py-1.5",
        lg: "text-base px-4 py-2"
      },
      hasArrow: {
        true: ""
      },
      showIcon: {
        true: "pl-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

// Tipos de posicionamento do tooltip
type TooltipPosition = 'top' | 'right' | 'bottom' | 'left'

// Tipos de alinhamento do tooltip
type TooltipAlign = 'start' | 'center' | 'end'

// Tipos de atraso do tooltip
type TooltipDelay = 'fast' | 'default' | 'slow' | number

// Componente Provider do Tooltip
const TooltipProvider = TooltipPrimitive.Provider

// Componente raiz do Tooltip
const Tooltip = TooltipPrimitive.Root

// Componente de gatilho do Tooltip
const TooltipTrigger = TooltipPrimitive.Trigger

// Componente de portal do Tooltip
const TooltipPortal = TooltipPrimitive.Portal

// Componente de seta do Tooltip
const TooltipArrow = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Arrow
    ref={ref}
    className={cn(
      "fill-current",
      className
    )}
    {...props}
  />
))
TooltipArrow.displayName = TooltipPrimitive.Arrow.displayName

interface TooltipContentProps 
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    VariantProps<typeof tooltipVariants> {
  /** Ícone personalizado */
  icon?: React.ReactNode
  /** Mostrar seta de indicação */
  arrow?: boolean
  /** Cor da seta */
  arrowColor?: string
  /** Largura máxima do tooltip */
  maxWidth?: string | number
  /** Posicionamento do tooltip */
  position?: TooltipPosition
  /** Alinhamento do tooltip */
  align?: TooltipAlign
  /** Atraso para exibição (ms) */
  delay?: TooltipDelay
  /** Se o tooltip deve ter um fundo escuro */
  darkMode?: boolean
  /** Se deve forçar o tooltip a ficar visível (para depuração) */
  forceMount?: boolean
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ 
  className, 
  variant = 'default',
  size = 'default',
  icon,
  arrow = true,
  arrowColor,
  maxWidth = '20rem',
  position = 'top',
  align = 'center',
  delay = 'default',
  darkMode = false,
  forceMount,
  children,
  sideOffset = 6,
  ...props 
}, ref) => {
  // Determina se deve mostrar o ícone
  const showIcon = Boolean(icon || variant !== 'default')
  // Obtém o ícone com base na variante, se não for fornecido um ícone personalizado
  const IconComponent = icon || (variant && variant in tooltipIcons ? tooltipIcons[variant as keyof typeof tooltipIcons] : null)
  
  // Configura o atraso com base nas opções pré-definidas
  const getDelayDuration = () => {
    if (typeof delay === 'number') return delay
    switch (delay) {
      case 'fast': return 100
      case 'slow': return 700
      default: return 300
    }
  }

  return (
    <TooltipPrimitive.Content
      ref={ref}
      side={position}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        tooltipVariants({ 
          variant: darkMode ? 'dark' : variant, 
          size, 
          hasArrow: arrow,
          showIcon,
          className 
        }),
        "max-w-[90vw] sm:max-w-[24rem]"
      )}
      style={{
        ...(maxWidth && { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }),
        ...props.style
      }}
      {...props}
    >
      {showIcon && IconComponent && (
        <span className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2",
          "flex items-center justify-center"
        )}>
          {React.isValidElement(icon) ? (
            React.cloneElement(icon as React.ReactElement, {
              className: cn(
                "h-4 w-4",
                variant === 'info' && "text-blue-500 dark:text-blue-400",
                variant === 'success' && "text-emerald-500 dark:text-emerald-400",
                variant === 'warning' && "text-amber-500 dark:text-amber-400",
                variant === 'error' && "text-red-500 dark:text-red-400",
                variant === 'dark' && "text-gray-400 dark:text-gray-800",
                (icon as React.ReactElement).props.className
              )
            })
          ) : (
            <IconComponent className={cn(
              "h-4 w-4",
              variant === 'info' && "text-blue-500 dark:text-blue-400",
              variant === 'success' && "text-emerald-500 dark:text-emerald-400",
              variant === 'warning' && "text-amber-500 dark:text-amber-400",
              variant === 'error' && "text-red-500 dark:text-red-400",
              variant === 'dark' && "text-gray-400 dark:text-gray-800"
            )} />
          )}
        </span>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
      
      {arrow && (
        <TooltipArrow 
          width={12} 
          height={6} 
          className={cn(
            arrowColor || (
              variant === 'info' ? 'text-blue-50 dark:text-blue-950/90' :
              variant === 'success' ? 'text-emerald-50 dark:text-emerald-950/90' :
              variant === 'warning' ? 'text-amber-50 dark:text-amber-950/90' :
              variant === 'error' ? 'text-red-50 dark:text-red-950/90' :
              variant === 'dark' ? 'text-gray-900 dark:text-white' :
              'bg-popover dark:bg-popover'
            )
          )} 
        />
      )}
    </TooltipPrimitive.Content>
  )
})
TooltipContent.displayName = TooltipPrimitive.Content.displayName

// Exemplo de uso:
/*
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Passe o mouse aqui</TooltipTrigger>
    <TooltipContent variant="info">
      Esta é uma dica de ferramenta informativa
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
*/

export {
  // Componentes
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipPortal,
  TooltipArrow,
  
  // Tipos
  type TooltipVariant,
  type TooltipPosition,
  type TooltipAlign,
  type TooltipDelay,
  type TooltipContentProps
}
