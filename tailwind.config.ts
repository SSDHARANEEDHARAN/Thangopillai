import animate from 'tailwindcss-animate'
import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.25rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        /* SkyBlue Birthday palette — every colour is a theme variable, so the
           whole site re-skins itself when the theme changes. */
        sky: {
          DEFAULT: 'rgb(var(--c-sky) / <alpha-value>)',
          deep: 'rgb(var(--c-sky-deep) / <alpha-value>)',
          ice: 'rgb(var(--c-sky-ice) / <alpha-value>)',
        },
        cloud: 'rgb(var(--c-cloud) / <alpha-value>)',
        lavender: 'rgb(var(--c-lavender) / <alpha-value>)',
        baby: 'rgb(var(--c-baby) / <alpha-value>)',
        champagne: 'rgb(var(--c-champagne) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        inkSoft: 'rgb(var(--c-ink-soft) / <alpha-value>)',
        /* Dark label colour for anything sitting on a pastel accent surface. */
        paintInk: 'rgb(var(--c-paint-ink) / <alpha-value>)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '4xl': '2rem',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        hand: ['Caveat', 'cursive'],
        ink: ['Kalam', 'cursive'],
      },
      boxShadow: {
        glass: '0 18px 50px -20px rgb(var(--c-ink) / 0.28), inset 0 1px 0 rgba(255,255,255,0.75)',
        float: '0 30px 70px -28px rgb(var(--c-ink) / 0.38)',
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
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        drift: {
          '0%': { transform: 'translateX(-10%)' },
          '100%': { transform: 'translateX(110%)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.25', transform: 'scale(0.85)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
        rise: {
          '0%': { transform: 'translateY(0) scale(0.9)', opacity: '0' },
          '15%': { opacity: '1' },
          '100%': { transform: 'translateY(-120px) scale(1.05)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        floaty: 'floaty 7s ease-in-out infinite',
        drift: 'drift 40s linear infinite',
        twinkle: 'twinkle 3.2s ease-in-out infinite',
        rise: 'rise 9s linear infinite',
        shimmer: 'shimmer 6s linear infinite',
      },
    },
  },
  plugins: [animate],
} satisfies Config
