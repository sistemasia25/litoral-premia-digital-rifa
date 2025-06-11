import * as React from "react"
import { cn } from "@/lib/utils"

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  variant?: 'default' | 'bordered' | 'striped' | 'hoverable' | 'compact'
  size?: 'sm' | 'default' | 'lg'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant = 'default', size = 'default', rounded = 'md', shadow = 'md', ...props }, ref) => {
    const tableClasses = cn(
      'w-full caption-bottom text-sm border-collapse',
      {
        // Variantes
        'divide-y divide-border': variant === 'default',
        'border border-border': variant === 'bordered',
        '[&_tbody_tr:nth-child(odd)]:bg-muted/20': variant === 'striped',
        '[&_tbody_tr:hover]:bg-muted/30': variant === 'hoverable' || variant === 'striped',
        
        // Tamanhos
        'text-xs': size === 'sm',
        'text-sm': size === 'default',
        'text-base': size === 'lg',
        
        // Sombras
        'shadow-sm': shadow === 'sm',
        'shadow-md': shadow === 'md',
        'shadow-lg': shadow === 'lg',
      },
      className
    )

    const containerRoundedClasses = {
      'rounded-none': rounded === 'none',
      'rounded-sm': rounded === 'sm',
      'rounded-md': rounded === 'md',
      'rounded-lg': rounded === 'lg',
      'rounded-xl': rounded === 'xl',
    }

    return (
      <div className={cn(
        'relative w-full overflow-auto',
        containerRoundedClasses
      )}>
        <table
          ref={ref}
          className={tableClasses}
          {...props}
        />
      </div>
    )
  }
)
Table.displayName = "Table"

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  sticky?: boolean
}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, sticky = false, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn(
        'bg-muted/50 [&_tr]:border-b [&_tr]:border-border',
        {
          'sticky top-0 z-10 backdrop-blur-sm': sticky,
        },
        className
      )}
      {...props}
    />
  )
)
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      '[&_tr:last-child]:border-0 [&_tr]:border-b [&_tr]:border-border/50',
      className
    )}
    {...props}
  />
))
TableBody.displayName = "TableBody"

interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  sticky?: boolean
}

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, sticky = false, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn(
        'bg-muted/50 font-medium border-t border-border',
        {
          'sticky bottom-0 z-10 backdrop-blur-sm': sticky,
        },
        className
      )}
      {...props}
    />
  )
)
TableFooter.displayName = "TableFooter"

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  active?: boolean
  hoverable?: boolean
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, active = false, hoverable = true, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b border-border/50 transition-colors',
        {
          'bg-primary/10': active,
          'hover:bg-muted/30': hoverable,
          'cursor-pointer': hoverable,
        },
        className
      )}
      {...props}
    />
  )
)
TableRow.displayName = "TableRow"

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sortable = false, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
        'whitespace-nowrap',
        {
          'cursor-pointer select-none hover:bg-muted/30 transition-colors': sortable,
        },
        '[&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  )
)
TableHead.displayName = "TableHead"

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'center' | 'right'
  nowrap?: boolean
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, align = 'left', nowrap = false, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        'p-4 align-middle',
        {
          'text-left': align === 'left',
          'text-center': align === 'center',
          'text-right': align === 'right',
          'whitespace-nowrap': nowrap,
        },
        '[&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  )
)
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground text-center", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  type TableProps,
  type TableHeaderProps,
  type TableFooterProps,
  type TableRowProps,
  type TableHeadProps,
  type TableCellProps,
}
