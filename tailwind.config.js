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
          bg: 'var(--color-bg)',
          card: 'var(--color-card)',
          text: 'var(--color-text)',
          'text-secondary': 'var(--color-text-secondary)',
          border: 'var(--color-border)'
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
