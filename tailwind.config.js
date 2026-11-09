/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fp: {
          blue: '#2563EB',
          indigo: '#4F46E5',
          'indigo-deep': '#4338CA',
          cyan: '#0EA5E9',
          slate: '#0F172A',
          tint: '#EEF2FF',
          'tint-border': '#E0E7FF',
          // Theme Aliases
          burgundy: '#4F46E5',
          cream: '#EEF2FF',
          sage: '#64748B',
          softsage: '#E2E8F0',
          offwhite: '#F8FAFC',
          charcoal: '#0F172A',
          success: '#10B981'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Inter"', '"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
