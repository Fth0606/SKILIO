/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#FDF8F1',
          100: '#F5E6CC',
          200: '#EDD4A0',
          400: '#D4AF37',
          500: '#C9A227',
          600: '#A0811F',
          900: '#5C4A1A',
        },
        accent: {
          400: '#F5F5F5',
          500: '#E0E0E0',
        },
        dark: {
          900: '#0D0D0D',
          800: '#141414',
          700: '#1A1A1A',
          600: '#2D2D2D',
          500: '#3D3D3D',
          400: '#4D4D4D',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
      }
    }
  },
  plugins: []
}
