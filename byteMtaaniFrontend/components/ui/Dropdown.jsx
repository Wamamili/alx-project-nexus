'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const dropdownClasses = cva(
  'relative inline-block text-left transition-all duration-200',
  {
    variants: {
      size: {
        small: 'text-sm',
        medium: 'text-base',
        large: 'text-lg',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  }
);

const Dropdown = ({
  // Required parameters with defaults
  placeholder = "Browse categories",
  text_font_size = "16",
  text_font_family = "Poppins",
  text_font_weight = "500", 
  text_line_height = "24px",
  text_text_align = "left",
  text_color = "#ffffff",
  fill_background_color = "#eca315",
  
  // Optional parameters (no defaults)
  layout_gap,
  layout_width,
  padding,
  position,
  
  // Standard React props
  options = [],
  value,
  onChange,
  disabled = false,
  size = 'medium',
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Safe validation for optional parameters
  const hasValidGap = layout_gap && typeof layout_gap === 'string' && layout_gap?.trim() !== '';
  const hasValidWidth = layout_width && typeof layout_width === 'string' && layout_width?.trim() !== '';
  const hasValidPadding = padding && typeof padding === 'string' && padding?.trim() !== '';
  const hasValidPosition = position && typeof position === 'string' && position?.trim() !== '';

  // Build optional Tailwind classes
  const optionalClasses = [
    hasValidGap ? `gap-[${layout_gap}]` : '',
    hasValidWidth ? `w-[${layout_width}]` : 'w-full',
    hasValidPadding ? `p-[${padding}]` : '',
    hasValidPosition ? position : '',
  ]?.filter(Boolean)?.join(' ');

  // Map style values to Tailwind classes or use direct values
  const fontSize = text_font_size === "16" ? 'text-md' : `text-[${text_font_size}px]`;
  const fontWeight = text_font_weight === "500" ? 'font-medium' : `font-[${text_font_weight}]`;
  const lineHeight = text_line_height === "24px" ? 'leading-base' : `leading-[${text_line_height}]`;
  const textAlign = text_text_align === "left" ? 'text-left' : `text-${text_text_align}`;
  const textColor = text_color === "#ffffff" ? 'text-primary-foreground' : `text-[${text_color}]`;
  const backgroundColor = fill_background_color === "#eca315" ? 'bg-accent-color' : `bg-[${fill_background_color}]`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionSelect = (option) => {
    if (typeof onChange === 'function') {
      onChange(option);
    }
    setIsOpen(false);
  };

  const selectedOption = options?.find(option => option?.value === value);

  return (
    <div
      ref={dropdownRef}
      className={twMerge(
        dropdownClasses({ size }),
        optionalClasses,
        className
      )}
      {...props}
    >
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={twMerge(
          'flex items-center justify-between w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          fontSize,
          `font-[${text_font_family}]`,
          fontWeight,
          lineHeight,
          textAlign,
          textColor,
          backgroundColor,
          hasValidPadding ? '' : 'px-4 py-2',
          'rounded-lg',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="truncate">
          {selectedOption ? selectedOption?.label : placeholder}
        </span>
        <svg
          className={twMerge(
            'w-5 h-5 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <ul className="py-1 max-h-60 overflow-auto" role="listbox">
            {options?.map((option, index) => (
              <li key={option?.value || index}>
                <button
                  type="button"
                  onClick={() => handleOptionSelect(option)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-900 transition-colors duration-150"
                  role="option"
                  aria-selected={value === option?.value}
                >
                  {option?.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;