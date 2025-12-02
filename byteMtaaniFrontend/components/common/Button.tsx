import React from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  // legacy props used across the app (accept but ignore/forward)
  text?: React.ReactNode;
  [key: string]: any;
}

export default function Button({
  children,
  text,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  className,
  ...rest
}: Props) {
  const base = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none';
  const sizes: Record<Size, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };
  const variants: Record<Variant, string> = {
    // Use brand tokens defined in the Tailwind config / CSS variables
    primary: 'bg-brandYellow text-white hover:opacity-95',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: 'border border-brandYellow text-brandYellow bg-transparent hover:bg-brandYellow/5',
    ghost: 'bg-transparent text-gray-900 hover:bg-gray-50',
  };

  return (
    <button
      className={clsx(base, sizes[size], variants[variant], (disabled || loading) && 'opacity-60 cursor-not-allowed', className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" /> : null}
      <span>{text ?? children}</span>
    </button>
  );
}
