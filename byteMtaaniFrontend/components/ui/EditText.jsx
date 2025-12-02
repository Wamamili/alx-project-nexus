'use client';

import React from 'react';
import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const editTextClasses = cva(
  'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      size: {
        small: 'text-sm px-3 py-1.5',
        medium: 'text-base px-4 py-2',
        large: 'text-lg px-6 py-3',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  }
);

const EditText = ({
  // Required parameters with defaults
  placeholder = 'Email address',
  text_font_size = '14',
  text_font_family = 'Poppins',
  text_font_weight = '600',
  text_line_height = '21px',
  text_text_align = 'left',
  text_color = '#ffffff',
  fill_background_color = '#eca315',
  border_border_radius = '20px',

  // Optional parameters (no defaults)
  layout_gap,
  layout_width,
  padding,
  position,

  // Standard React props
  size,
  type = 'text',
  value,
  onChange,
  disabled = false,
  className,
  ...props
}) => {
  const hasValidGap = layout_gap && typeof layout_gap === 'string' && layout_gap.trim() !== '';
  const hasValidWidth = layout_width && typeof layout_width === 'string' && layout_width.trim() !== '';
  const hasValidPadding = padding && typeof padding === 'string' && padding.trim() !== '';
  const hasValidPosition = position && typeof position === 'string' && position.trim() !== '';

  const optionalClasses = [
    hasValidGap ? `gap-[${layout_gap}]` : '',
    hasValidWidth ? `w-[${layout_width}]` : 'w-full',
    hasValidPadding ? `p-[${padding}]` : '',
    hasValidPosition ? position : '',
  ]
    .filter(Boolean)
    .join(' ');

  const fontSize = text_font_size === '14' ? 'text-base' : `text-[${text_font_size}px]`;
  const fontWeight = text_font_weight === '600' ? 'font-semibold' : `font-[${text_font_weight}]`;
  const lineHeight = text_line_height === '21px' ? 'leading-tight' : `leading-[${text_line_height}]`;
  const textAlign = text_text_align === 'left' ? 'text-left' : `text-${text_text_align}`;
  const textColor = text_color === '#ffffff' ? 'text-primary-foreground' : `text-[${text_color}]`;
  const backgroundColor =
    fill_background_color === '#eca315' ? 'bg-accent-color' : `bg-[${fill_background_color}]`;
  const borderRadius = border_border_radius === '20px' ? 'rounded-lg' : `rounded-[${border_border_radius}]`;

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={twMerge(
        editTextClasses({ size }),
        fontSize,
        `font-[${text_font_family}]`,
        fontWeight,
        lineHeight,
        textAlign,
        textColor,
        backgroundColor,
        borderRadius,
        'placeholder:text-white/70',
        optionalClasses,
        className
      )}
      {...props}
    />
  );
};

export default EditText;
