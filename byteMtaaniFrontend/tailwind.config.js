module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    screens: {
      sm: '640px',   
      md: '768px',    
      lg: '1024px',   
      xl: '1280px',
      '2xl': '1536px'
    },

    extend: {
      colors: {
        // Primary Colors
        primary: {
          background: "var(--primary-background)",
          foreground: "var(--primary-foreground)",
          light: "var(--primary-light)",
          dark: "var(--primary-dark)"
        },
        // Secondary Colors
        secondary: {
          background: "var(--secondary-background)",
          foreground: "var(--secondary-foreground)",
          light: "var(--secondary-light)",
          dark: "var(--secondary-dark)"
        },
        // Accent Colors
        accent: {
          color: "var(--accent-color)",
          foreground: "var(--accent-foreground)",
          light: "var(--accent-light)",
          success: "var(--accent-success)"
        },
        // Text Colors
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          light: "var(--text-light)",
          dark: "var(--text-dark)"
        },
        // Background Colors
        background: {
          main: "var(--bg-main)",
          light: "var(--bg-light)",
          soft: "var(--bg-soft)",
          neutral: "var(--bg-neutral)",
          muted: "var(--bg-muted)",
          accentLight: "var(--bg-accent-light)",
          accentSoft: "var(--bg-accent-soft)"
        },
        // Border Colors
        border: {
          primary: "var(--border-primary)",
          secondary: "var(--border-secondary)",
          light: "var(--border-light)",
          muted: "var(--border-muted)",
          accent: "var(--border-accent)"
        },
        // Component-specific colors
        header: {
          background: "var(--header-background)",
          text: "var(--header-text)"
        },
        button: {
          primaryBg: "var(--button-primary-bg)",
          secondaryBg: "var(--button-secondary-bg)",
          accentBg: "var(--button-accent-bg)"
        },
        search: {
          background: "var(--search-background)"
        },
        footer: {
          background: "var(--footer-background)"
        }
      },
      // Typography
      fontSize: {
        'xs': 'var(--font-size-xs)',
        'sm': 'var(--font-size-sm)',
        'base': 'var(--font-size-base)',
        'md': 'var(--font-size-md)',
        'lg': 'var(--font-size-lg)',
        'xl': 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)'
      },
      fontWeight: {
        'normal': 'var(--font-weight-normal)',
        'medium': 'var(--font-weight-medium)',
        'semibold': 'var(--font-weight-semibold)',
        'bold': 'var(--font-weight-bold)'
      },
      lineHeight: {
        'tight': 'var(--line-height-tight)',
        'base': 'var(--line-height-base)',
        'relaxed': 'var(--line-height-relaxed)',
        'loose': 'var(--line-height-loose)'
      },
      // Spacing
      spacing: {
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'base': 'var(--spacing-base)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)'
      },
      // Border Radius
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'base': 'var(--radius-base)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)'
      },
      // Layout
      maxWidth: {
        'container': 'var(--container-width)'
      },
      padding: {
        'footer': 'var(--footer-padding)'
      }
    }
  },
  plugins: []
};