/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
  ],
  safelist: [
    // Professional non-colorful patterns
    'bg-white/10',
    'bg-white/15',
    'bg-white/20',
    'hover:bg-white/10',
    'hover:bg-white/20',
    'text-white/70',
    'text-white/80',
    'text-white/90',
    'border-white/20',
    'border-white/30',
    'bg-white/90',
    'hover:bg-white/90',
    'bg-white/5',
    'bg-white/80',
    'bg-black/50',
    'bg-primary/5',
    'bg-primary/10',
    'bg-primary/90',
    'hover:bg-primary/10',
    'hover:bg-primary/90',
    'bg-destructive/90',
    'hover:bg-destructive/90',
    'bg-warning/5',
    'bg-warning/10',
    'bg-warning/20',
    'border-warning/20',
    'text-warning/80',
    'text-primary/80',
    'hover:text-primary/80',
    'border-primary/50',
    'hover:border-primary/50',
    'bg-muted/30',
    'bg-background/80',
    'dark:text-white/70',
    // Monochromatic color variants  
    'bg-slate-500',
    'bg-slate-500/10',
    'text-slate-500',
    'bg-slate-600',
    'bg-slate-600/10', 
    'text-slate-600',
    'bg-slate-700',
    'bg-slate-700/10',
    'text-slate-700',
    'bg-gray-500',
    'bg-gray-500/10',
    'text-gray-500',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Professional monochromatic palette
        "professional-primary": "#334155",    // slate-700
        "professional-secondary": "#475569",  // slate-600
        "professional-accent": "#64748b",     // slate-500
        "professional-muted": "#94a3b8",      // slate-400
        "professional-subtle": "#cbd5e1",     // slate-300
        "professional-border": "#e2e8f0",     // slate-200
        "professional-bg": "#f8fafc",         // slate-50
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.6rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
      },
      boxShadow: {
        'professional': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'professional-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'professional-xl': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}