// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        primary: '#141B2A',
        // Add dark mode specific colors if needed
        dark: {
          primary: '#0F141F',
          secondary: '#1A2333',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      }, 
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      // Add dark mode specific background colors
      backgroundColor: {
        'dark-primary': '#0F141F',
        'dark-secondary': '#1A2333',
      }
    },
  },
  plugins: [],
}
