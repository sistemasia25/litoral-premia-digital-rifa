import { cn } from '@/lib/utils';
import React from 'react';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large' | number;
  className?: string;
}

const sizeMap: Record<'small' | 'medium' | 'large', string> = {
  small: 'h-4 w-4',
  medium: 'h-6 w-6',
  large: 'h-10 w-10',
};

export function Spinner({ size = 'medium', className }: SpinnerProps) {
  const sizeClass = typeof size === 'number' ? `h-[${size}px] w-[${size}px]` : sizeMap[size];

  return (
    <svg
      className={cn('animate-spin text-indigo-500', sizeClass, className)}
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
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export default Spinner;
