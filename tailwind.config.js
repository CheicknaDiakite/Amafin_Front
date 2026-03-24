/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        borderColorAnimation: {
          '0%': { borderColor: '#0d00ff' },
          '25%': { borderColor: '#00ff04' },
          '50%': { borderColor: '#ffee00' },
          '75%': { borderColor: '#ff0000' },
          '100%': { borderColor: '#000000' },
        },
        gradient: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
      },
      animation: {
        'border-rotate': 'borderColorAnimation 4s linear infinite',
        'gradient-animate': 'gradient 5s ease infinite',
      },
    },
  },
  plugins: [],
}

