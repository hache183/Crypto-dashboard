/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'crypto-dark': '#0f172a',
        'crypto-darker': '#020617',
        'crypto-blue': '#3b82f6',
        'crypto-green': '#10b981',
        'crypto-red': '#ef4444',
      }
    },
  },
  plugins: [],
}