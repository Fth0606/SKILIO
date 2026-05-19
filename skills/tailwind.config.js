/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#E1F5EE',
          100: '#9FE1CB',
          200: '#5DCAA5',
          400: '#1D9E75',
          500: '#0F6E56',
          600: '#085041',
          900: '#04342C',
        },
        accent: {
          400: '#EF9F27',
          500: '#BA7517',
        },
        dark: {
          900: '#070c09',
          800: '#0a0f0d',
          700: '#0d1511',
          600: '#111814',
          500: '#1e2b24',
          400: '#2a3d31',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
      }
    }
  },
  plugins: []
}