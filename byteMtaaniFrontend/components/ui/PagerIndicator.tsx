"use client";
import React from 'react';

interface Props {
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (p: number) => void;
  layout_width?: string;
  className?: string;
  [key: string]: any;
}

export default function PagerIndicator({ totalPages = 5, currentPage = 1, onPageChange, layout_width, className }: Props) {
  const style = layout_width ? { width: layout_width } : undefined;
  return (
    <div style={style} className={`flex items-center gap-2 ${className ?? ''}`}>
      {Array.from({ length: totalPages }, (_, i) => (
        <button key={i} onClick={() => onPageChange?.(i + 1)} className={`w-2 h-2 rounded-full ${currentPage === i + 1 ? 'bg-blue-600 w-6' : 'bg-gray-300'}`} aria-label={`Page ${i + 1}`} />
      ))}
    </div>
  );
}
