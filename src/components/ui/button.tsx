import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Botão primário - Laranja vibrante
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow hover:shadow-md active:scale-[0.98]",
        
        // Botão secundário - Azul
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow hover:shadow-md active:scale-[0.98]",
        
        // Botão de destaque - Verde
        success: "bg-success text-success-foreground hover:bg-success/90 shadow hover:shadow-md active:scale-[0.98]",
        
        // Botão de perigo - Vermelho
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow hover:shadow-md active:scale-[0.98]",
        
        // Botão de aviso - Amarelo
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 shadow hover:shadow-md active:scale-[0.98]",
        
        // Botão de informação - Azul claro
        info: "bg-info text-info-foreground hover:bg-info/90 shadow hover:shadow-md active:scale-[0.98]",
        
        // Botão outline - Borda com fundo transparente
        outline: "border border-input bg-transparent hover:bg-accent/50 hover:text-accent-foreground shadow-sm hover:shadow active:scale-[0.98]",
        
        // Botão ghost - Apenas texto com hover sutil
        ghost: "hover:bg-accent/30 hover:text-accent-foreground active:scale-[0.98]",
        
        // Botão link - Apenas texto sublinhado
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
        
        // Botão gradiente - Efeito de gradiente
        gradient: "bg-gradient-to-r from-primary to-[#FF8C00] text-primary-foreground hover:opacity-90 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-300"
      },
      size: {
        xs: "h-8 rounded px-2.5 text-xs",
        sm: "h-9 rounded-md px-3 text-sm",
        default: "h-10 px-4 py-2 text-sm",
        lg: "h-11 rounded-lg px-6 text-base",
        xl: "h-12 rounded-lg px-8 text-base font-semibold",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8 p-0",
        "icon-lg": "h-12 w-12 p-0"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
