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
        // Semantic colors for homicide context
        danger: '#EF4444',    // Red: increase in homicides (bad)
        success: '#10B981',   // Green: decrease in homicides (good)
        accent: '#3B82F6'
      }
    }
  },
  plugins: [],
}
