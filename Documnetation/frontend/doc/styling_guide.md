Styling Guide

This guide outlines the styling rules used in the frontend. TailwindCSS powers all layout, spacing, and design choices to maintain consistency across screens.

Color System

The color palette supports clarity and visual hierarchy across the application.

Primary Colors

primary: bg-blue-600 for main actions

primary-light: bg-blue-500

primary-dark: bg-blue-700

Neutral Colors

text: text-gray-800, text-gray-600

background: bg-gray-50, bg-white

borders: border-gray-200

Status Colors

success: text-green-600, bg-green-100

error: text-red-600, bg-red-100

warning: text-yellow-600, bg-yellow-100

Spacing Scale

All spacing uses Tailwind’s standard scale to maintain alignment across layouts.

Common values:

p-2, p-3, p-4

m-2, m-4, m-6

gap-2, gap-4, gap-6

Use larger values only for major section spacing:

py-10, py-12, px-8

Breakpoints

The project uses Tailwind’s defaults to ensure consistent responsive behavior.

sm → 640px

md → 768px

lg → 1024px

xl → 1280px

2xl → 1536px

Example
<div className="p-4 md:p-8 lg:p-12">
  Responsive content
</div>

Typography Rules

Text styling uses consistent sizes and weights for clarity.

Font Sizes

text-sm for minor labels

text-base for standard text

text-lg for section emphasis

text-xl and above for headers

Font Weights

font-medium for normal emphasis

font-semibold for titles

font-bold for major headings

Line Height

Use Tailwind defaults: leading-normal, leading-relaxed

Class Naming Rules

Use utility classes for layout and spacing.

Use component-level CSS only when needed for complex UI.

Keep class lists short by grouping structure logically:

Layout classes first

Spacing next

Typography last

Example:

<div className="flex flex-col gap-4 p-6 text-gray-800">

Component Consistency Rules

Use the same padding pattern across sections: py-10 for page sections.

Use consistent border-radius values: rounded-md for inputs and buttons.

Use shadow-sm and shadow-md for depth.