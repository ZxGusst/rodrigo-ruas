import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: 'clamp(24px, 5vw, 64px)',
      screens: { '2xl': '1440px' },
    },
    extend: {
      /* ─── CORES (mapeadas nos CSS vars do globals.css) ─── */
      colors: {
        border:     'hsl(var(--border))',
        input:      'hsl(var(--input))',
        ring:       'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        warning: {
          DEFAULT:    'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        success: {
          DEFAULT:    'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },

        /* Escala navy — usada diretamente com navy-900, navy-600 etc */
        navy: {
          50:      '#F0F6FA',
          100:     '#D1E2EE',
          200:     '#A8C4D8',
          300:     '#7EA6BE',
          400:     '#5588A4',
          500:     '#3D6A82',
          600:     '#2E5068',
          700:     '#1E3347',
          800:     '#152B3E',
          900:     '#0D1F30',
          DEFAULT: '#0D1F30',
        },

        /* Escala warm-gray — off-white ao escuro */
        'warm-gray': {
          50:  '#FAFAF8',
          100: '#F3F1EC',
          200: '#E8E4DF',
          300: '#D4CEC6',
          400: '#A8A09A',
          500: '#78706A',
          600: '#504840',
          700: '#302C28',
          800: '#1C1816',
          900: '#0D0C0B',
        },
      },

      /* ─── TIPOGRAFIA ────────────────────────────────────── */
      fontFamily: {
        sans: ['DM Sans', 'var(--font-sans)', '-apple-system', 'sans-serif'],
      },

      fontSize: {
        'xs':   ['11px', { lineHeight: '1.5',  letterSpacing: '0.01em'  }],
        'sm':   ['13px', { lineHeight: '1.5',  letterSpacing: '0'       }],
        'base': ['15px', { lineHeight: '1.75', letterSpacing: '0'       }],
        'md':   ['17px', { lineHeight: '1.7',  letterSpacing: '0'       }],
        'lg':   ['20px', { lineHeight: '1.6',  letterSpacing: '0'       }],
        'xl':   ['24px', { lineHeight: '1.3',  letterSpacing: '-0.01em' }],
        '2xl':  ['32px', { lineHeight: '1.2',  letterSpacing: '-0.01em' }],
        '3xl':  ['40px', { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        '4xl':  ['56px', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        '5xl':  ['72px', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
      },

      fontWeight: {
        light:    '300',
        normal:   '400',
        medium:   '500',
        semibold: '600',
        bold:     '700',
      },

      /* ─── BORDER RADIUS ─────────────────────────────────── */
      borderRadius: {
        lg:   'var(--radius)',                      /* 8px  */
        md:   'calc(var(--radius) - 2px)',          /* 6px  */
        sm:   'calc(var(--radius) - 4px)',          /* 4px  */
        xl:   'calc(var(--radius) * 2)',            /* 16px */
        '2xl':'calc(var(--radius) * 3)',            /* 24px */
        full: '9999px',
      },

      /* ─── ESPAÇAMENTO EXTRA ─────────────────────────────── */
      spacing: {
        '18': '72px',
        '22': '88px',
        '26': '104px',
        '30': '120px',
      },

      /* ─── SOMBRAS (com tint navy) ───────────────────────── */
      boxShadow: {
        sm:  '0 1px 3px rgba(13, 31, 48, 0.08)',
        md:  '0 4px 12px rgba(13, 31, 48, 0.10)',
        lg:  '0 8px 24px rgba(13, 31, 48, 0.12)',
        xl:  '0 16px 48px rgba(13, 31, 48, 0.14)',
        '2xl':'0 24px 64px rgba(13, 31, 48, 0.16)',
      },

      /* ─── ANIMAÇÕES ─────────────────────────────────────── */
      transitionTimingFunction: {
        'out-quint': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'in-out':    'cubic-bezier(0.4, 0, 0.2, 1)',
        'expo':      'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      transitionDuration: {
        fast:   '220ms',
        medium: '400ms',
        slow:   '650ms',
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'fade-in':        'fade-in 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
