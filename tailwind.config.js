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
          burgundy: '#590907',
          cream: '#E8D2B5',
          sage: '#A5A79B',
          softsage: '#D8D9D0',
          offwhite: '#F8F6F1',
          charcoal: '#242321',
          success: '#299D68'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
};

