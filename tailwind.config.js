/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#22201b',
        paper: '#f2efe8',
        berry: {
          50: '#fbecec',
          100: '#f6dbd9',
          200: '#eab3ae',
          300: '#dc8983',
          400: '#c85f57',
          500: '#a8433f',
          600: '#8c2f39',
          700: '#742630',
          800: '#5d1f27',
          900: '#4a1a21',
        },
        wood: {
          50: '#faf6f0',
          100: '#f2e6d4',
          200: '#e3cda6',
          300: '#cfae7c',
          400: '#b28f5c',
          500: '#96774c',
          600: '#8a6a47',
          700: '#6f5439',
          800: '#59432f',
          900: '#493827',
        },
      },
    },
  },
  plugins: [],
};
