import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--on-primary)',
          container: 'var(--primary-container)',
          'container-foreground': 'var(--on-primary-container)',
          fixed: 'var(--primary-fixed)',
          'fixed-dim': 'var(--primary-fixed-dim)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--on-secondary)',
          container: 'var(--secondary-container)',
          'container-foreground': 'var(--on-secondary-container)',
        },
        tertiary: {
          DEFAULT: 'var(--tertiary)',
          foreground: 'var(--on-tertiary)',
          container: 'var(--tertiary-container)',
          'container-foreground': 'var(--on-tertiary-container)',
        },
        background: 'var(--background)',
        foreground: 'var(--on-background)',
        surface: {
          DEFAULT: 'var(--surface)',
          foreground: 'var(--on-surface)',
          dim: 'var(--surface-dim)',
          bright: 'var(--surface-bright)',
          'container-lowest': 'var(--surface-container-lowest)',
          'container-low': 'var(--surface-container-low)',
          container: 'var(--surface-container)',
          'container-high': 'var(--surface-container-high)',
          'container-highest': 'var(--surface-container-highest)',
          variant: 'var(--on-surface-variant)',
        },
        outline: {
          DEFAULT: 'var(--outline)',
          variant: 'var(--outline-variant)',
        },
        error: {
          DEFAULT: 'var(--error)',
          foreground: 'var(--on-error)',
        },
        success: {
          DEFAULT: 'var(--success)',
          foreground: 'var(--on-success)',
        },
      },
      fontFamily: {
        headline: ['"Newsreader"', 'Georgia', 'serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-lg': ['3.75rem', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        'display-md': ['2.875rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'headline-lg': ['1.875rem', { lineHeight: '1.25' }],
        'headline-md': ['1.5rem', { lineHeight: '1.3' }],
        'headline-sm': ['1.25rem', { lineHeight: '1.35' }],
        'label-lg': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0.06em' }],
        'label-md': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.09em' }],
        'label-sm': ['0.625rem', { lineHeight: '1.4', letterSpacing: '0.12em' }],
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
      },
      boxShadow: {
        'editorial-xs': '0 1px 2px 0 rgb(18 19 26 / 0.03)',
        'editorial-sm': '0 4px 20px -2px rgb(18 19 26 / 0.04)',
        'editorial-md': '0 12px 30px -4px rgb(18 19 26 / 0.06)',
        'editorial-lg': '0 24px 60px -12px rgb(18 19 26 / 0.10)',
      },
      keyframes: {
        'fade-up': { from: { opacity: '0', transform: 'translateY(14px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'scale-in': { from: { opacity: '0', transform: 'scale(0.97)' }, to: { opacity: '1', transform: 'scale(1)' } },
        'slide-in-right': { from: { opacity: '0', transform: 'translateX(16px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.8', filter: 'drop-shadow(0 0 2px rgba(197,168,92,0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 12px rgba(197,168,92,0.7))' },
        },
        'spin-slow': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        /* — gentle floating drift for illustrative ornaments — */
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-9px)' },
        },
        'float-x': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(6px, -7px)' },
        },
        /* — twinkling stars on the constellation — */
        twinkle: {
          '0%, 100%': { opacity: '0.25', transform: 'scale(0.85)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
        /* — ink line drawing itself across a heading or seal — */
        draw: {
          from: { strokeDashoffset: 'var(--draw-len, 400)' },
          to: { strokeDashoffset: '0' },
        },
        /* — a light sweeping across foil / a map — */
        sheen: {
          '0%': { transform: 'translateX(-120%) skewX(-18deg)' },
          '100%': { transform: 'translateX(220%) skewX(-18deg)' },
        },
        'compass-needle': {
          '0%, 100%': { transform: 'rotate(-7deg)' },
          '50%': { transform: 'rotate(7deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 600ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 500ms ease both',
        'scale-in': 'scale-in 400ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in-right': 'slide-in-right 450ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-glow': 'pulse-glow 3s infinite ease-in-out',
        'spin-slow': 'spin-slow 22s linear infinite',
        shimmer: 'shimmer 3s infinite linear',
        float: 'float 7s ease-in-out infinite',
        'float-slow': 'float 11s ease-in-out infinite',
        'float-x': 'float-x 9s ease-in-out infinite',
        twinkle: 'twinkle 4s ease-in-out infinite',
        draw: 'draw 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        sheen: 'sheen 4.5s ease-in-out infinite',
        'compass-needle': 'compass-needle 9s ease-in-out infinite',
      },
      typography: {},
    },
  },
  plugins: [],
} satisfies Config;
