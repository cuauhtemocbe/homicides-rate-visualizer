/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#121212',
          card: '#1E1E1E',
          text: '#E0E0E0',
          'text-secondary': '#B0B0B0',
          border: '#2A2A2A'
        },
        growth: {
          positive: '#EF4444',
          negative: '#10B981'
        },
        accent: '#3B82F6'
      }
    }
  },
  plugins: [],
}
