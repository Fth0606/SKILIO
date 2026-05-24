/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          900: '#14532D',
        },
        accent: {
          50:  '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          400: '#F9A8D4',
          500: '#EC4899',
          600: '#DB2777',
        },
        dark: {
          900: '#0A0A0A',
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
