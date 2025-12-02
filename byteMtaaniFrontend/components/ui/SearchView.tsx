'use client';

import React, { useState } from 'react';
import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

// Tailwind classes with cva
const searchClasses = cva(
  'inline-flex items-center transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500',
  {
    variants: {
      variant: {
        default: 'border border-gray-300',
        filled: 'border border-transparent',
        outline: 'border-2 border-gray-400 bg-transparent',
      },
      size: {
        small: 'text-xs px-2 py-1',
        medium: 'text-sm px-3 py-2',
        large: 'text-base px-4 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'medium',
    },
  }
);

interface SearchViewProps {
  placeholder?: string;
  text_font_size?: string;
  text_font_family?: string;
  text_font_weight?: string;
  text_line_height?: string;
  text_text_align?: string;
  text_color?: string;
  fill_background_color?: string;
  border_border_radius?: string;
  layout_width?: string;
  padding?: string;
  position?: string;
  variant?: 'default' | 'filled' | 'outline';
  size?: 'small' | 'medium' | 'large';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  accent?: boolean;
}

const SearchView: React.FC<SearchViewProps> = ({
  placeholder = 'Search any things',
  text_font_size = 'text-sm',
  text_font_family = 'Poppins',
  text_font_weight = 'font-normal',
  text_line_height = 'leading-snug',
  text_text_align = 'left',
  text_color = 'text-text-secondary',
  fill_background_color = 'bg-search-background',
  border_border_radius = 'rounded-xl',
  layout_width,
  padding,
  position,
  variant,
  size,
  value,
  onChange,
  onSubmit,
  disabled = false,
  className,
  accent = false,
  ...props
}) => {
  const [searchValue, setSearchValue] = useState(value || '');

  const optionalClasses = [
    layout_width ? `w-[${layout_width}]` : 'w-full',
    padding ? `p-[${padding}]` : '',
    position || '',
  ]
    .filter(Boolean)
    .join(' ');

  const baseClasses = [
    text_font_size,
    `font-[${text_font_family}]`,
    text_font_weight,
    text_line_height,
    `text-${text_text_align}`,
    text_color,
    fill_background_color,
    border_border_radius,
  ].join(' ');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onChange?.(e);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(searchValue);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={twMerge(searchClasses({ variant, size }), baseClasses, optionalClasses, className)}
    >
      <input
        type="search"
        value={searchValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-transparent border-none outline-none placeholder:text-gray-400"
        {...props}
      />
      <button
        type="submit"
        className={accent ? 'ml-2 p-1 rounded-full transition-colors bg-brandYellow/10 hover:bg-brandYellow/20' : 'ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors'}
        aria-label="Search"
      >
        <svg
          className={accent ? 'w-4 h-4 text-brandYellow' : 'w-4 h-4 text-gray-500'}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </form>
  );
};

export default SearchView;
