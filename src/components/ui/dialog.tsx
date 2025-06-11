import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

interface DialogOverlayProps 
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {
  blur?: boolean
  overlayColor?: string
}

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DialogOverlayProps
>(({ className, blur = true, overlayColor = 'bg-black/80', ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 overflow-y-auto',
      'flex items-center justify-center p-4',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      overlayColor,
      blur && 'backdrop-blur-sm',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

interface DialogContentProps 
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  closeButton?: boolean
  overlayProps?: DialogOverlayProps
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'full'
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right'
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ 
  className, 
  children, 
  closeButton = true, 
  overlayProps,
  size = 'default',
  position = 'center',
  ...props 
}, ref) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    default: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    full: 'max-w-full h-full',
  }

  const positionClasses = {
    center: 'sm:translate-y-[-50%] sm:top-[50%]',
    top: 'sm:top-4 sm:translate-y-0',
    bottom: 'sm:bottom-4 sm:top-auto sm:translate-y-0',
    left: 'sm:left-4 sm:right-auto sm:translate-x-0 sm:top-4 sm:bottom-4',
    right: 'sm:right-4 sm:left-auto sm:translate-x-0 sm:top-4 sm:bottom-4',
  }

  return (
    <DialogPortal>
      <DialogOverlay {...overlayProps} />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed left-1/2 top-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4',
          'bg-background shadow-lg transition-all duration-200',
          'border border-border rounded-lg',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
          'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
          'p-6',
          sizeClasses[size],
          positionClasses[position],
          className
        )}
        {...props}
      >
        {children}
        {closeButton && (
          <DialogPrimitive.Close 
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Fechar</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  withBorder?: boolean
  align?: 'start' | 'center' | 'end'
}

const DialogHeader = ({
  className,
  withBorder = false,
  align = 'start',
  ...props
}: DialogHeaderProps) => {
  const alignment = {
    start: 'text-left',
    center: 'text-center',
    end: 'text-right',
  }

  return (
    <div
      className={cn(
        'flex flex-col space-y-1.5',
        withBorder && 'pb-4 mb-4 border-b border-border',
        alignment[align],
        className
      )}
      {...props}
    />
  )
}
DialogHeader.displayName = "DialogHeader"

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  withBorder?: boolean
  align?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  direction?: 'row' | 'column'
}

const DialogFooter = ({
  className,
  withBorder = false,
  align = 'end',
  direction = 'row',
  ...props
}: DialogFooterProps) => {
  const alignment = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  }

  const flexDirection = {
    row: 'flex-row',
    column: 'flex-col',
  }

  return (
    <div
      className={cn(
        'flex gap-2',
        alignment[align],
        flexDirection[direction],
        withBorder && 'pt-4 mt-4 border-t border-border',
        'sm:flex-row',
        className
      )}
      {...props}
    />
  )
}
DialogFooter.displayName = "DialogFooter"

interface DialogTitleProps 
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {
  asChild?: boolean
  icon?: React.ReactNode
}

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(({ className, icon, children, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-xl font-semibold leading-none tracking-tight flex items-center gap-2',
      className
    )}
    {...props}
  >
    {icon && <span className="text-muted-foreground">{icon}</span>}
    {children}
  </DialogPrimitive.Title>
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

interface DialogDescriptionProps 
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {
  asChild?: boolean
}

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

// Dialog compound component
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  // Types
  type DialogOverlayProps,
  type DialogContentProps,
  type DialogHeaderProps,
  type DialogFooterProps,
  type DialogTitleProps,
  type DialogDescriptionProps,
}
