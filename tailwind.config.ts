import type { Config } from 'tailwindcss';

export default {
  content: ['./dist/**/*.html'],
  theme: {
    extend: {
      colors: {
        'civic-blue': {
          50: '#f0f6ff',
          100: '#e0ecff',
          200: '#c7deff',
          300: '#a3ceff',
          400: '#7ab5ff',
          500: '#4a90ff',
          600: '#2563eb',
          700: '#1d47b6',
          800: '#1a3a8a',
          900: '#0f1e47',
        },
        'civic-green': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#145231',
        },
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        slideIn: {
          'from': { transform: 'translateX(100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
} satisfies Config;
