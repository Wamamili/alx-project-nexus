'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/* =======================
   ChipView Component
======================= */
const chipClasses = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none rounded-full gap-1',
  {
    variants: {
      variant: {
        filled: 'bg-blue-500 text-white hover:bg-blue-600',
        outlined: 'border-2 border-blue-500 text-blue-500 bg-transparent hover:bg-blue-50',
        soft: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      },
      size: {
        small: 'text-xs px-2 py-1 h-6',
        medium: 'text-sm px-3 py-1.5 h-8',
        large: 'text-base px-4 py-2 h-10',
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'medium',
    },
  }
);

export const ChipView = ({
  layout_width,
  position,
  children,
  text = 'Chip',
  variant = 'filled',
  size = 'medium',
  selected = false,
  disabled = false,
  removable = false,
  onRemove,
  onClick,
  className,
  ...props
}) => {
  const optionalClasses = [
    layout_width ? `w-[${layout_width}]` : '',
    position || '',
  ].filter(Boolean).join(' ');

  const handleClick = (event) => {
    if (disabled) return;
    onClick?.(event);
  };

  const handleRemove = (event) => {
    event.stopPropagation();
    onRemove?.();
  };

  return (
    <span
      onClick={handleClick}
      className={twMerge(
        chipClasses({ variant, size }),
        selected && 'ring-2 ring-blue-300',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && 'hover:shadow-sm',
        optionalClasses,
        className
      )}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      {...props}
    >
      {children || text}
      {removable && !disabled && (
        <button
          onClick={handleRemove}
          className="ml-1 w-4 h-4 rounded-full hover:bg-black/10 flex items-center justify-center"
          aria-label="Remove"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 4.586L9.293 1.293a1 1 0 111.414 1.414L7.414 6l3.293 3.293a1 1 0 11-1.414 1.414L6 7.414l-3.293 3.293a1 1 0 01-1.414-1.414L4.586 6 1.293 2.707a1 1 0 011.414-1.414L6 4.586z" />
          </svg>
        </button>
      )}
    </span>
  );
};

/* =======================
   Dropdown Component
======================= */
const dropdownClasses = cva(
  'relative inline-flex items-center justify-between border transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md',
  {
    variants: {
      variant: {
        default: 'border-gray-300 hover:border-gray-400 bg-white',
        filled: 'border-transparent bg-gray-100',
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

export const Dropdown = ({
  placeholder = "Browse categories",
  text_font_size = "text-md",
  text_font_family = "Poppins",
  text_font_weight = "font-medium",
  text_line_height = "leading-md",
  text_text_align = "left",
  text_color = "text-primary-foreground",
  fill_background_color = "bg-secondary-background",
  layout_gap,
  layout_width,
  padding,
  position,
  variant,
  size,
  options = [],
  value,
  onChange,
  disabled = false,
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const dropdownRef = useRef(null);

  const optionalClasses = [
    layout_width ? `w-[${layout_width}]` : 'w-full',
    padding ? `p-[${padding}]` : '',
    position || '',
    layout_gap ? `gap-[${layout_gap}]` : 'gap-4',
  ].filter(Boolean).join(' ');

  const baseClasses = [
    text_font_size,
    `font-[${text_font_family}]`,
    text_font_weight,
    text_line_height,
    `text-${text_text_align}`,
    text_color,
    fill_background_color,
  ].join(' ');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionSelect = (option) => {
    setSelectedValue(option?.value);
    setIsOpen(false);
    onChange?.(option);
  };

  const selectedOption = options.find(option => option?.value === selectedValue);
  const displayText = selectedOption?.label ?? placeholder;

  return (
    <div ref={dropdownRef} className="relative">
      <div
        className={twMerge(
          dropdownClasses({ variant, size }),
          baseClasses,
          optionalClasses,
          className,
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        {...props}
      >
        <span className="flex-1 truncate">{displayText}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">No options available</div>
          ) : (
            <ul role="listbox" className="py-1">
              {options.map((option, index) => (
                <li
                  key={option?.value || index}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  onClick={() => handleOptionSelect(option)}
                  role="option"
                  aria-selected={selectedValue === option?.value}
                >
                  {option?.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
