/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#90EE90', // Changed to Light Green
        'dark-gray': '#1a1a1a',
        'trading-dark': '#1E222D',
        'trading-darker': '#13151A',
        'trading-green': '#26a69a',
        'trading-red': '#ef5350',
        primary: {
          DEFAULT: '#10b981',
          hover: '#059669',
        },
        dark: {
          DEFAULT: '#0f172a',
          card: '#1e293b',
        }
      },
    },
  },
  plugins: [],
}