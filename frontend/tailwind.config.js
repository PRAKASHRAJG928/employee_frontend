/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        frijole: ['Frijole', 'sans-serif'],
        pacifico: ['Pacifico', 'cursive'],
        'great-vibes': ['Great Vibes', 'cursive'],
      },
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          glow: '#818CF8',
        },
        sidebar: {
          bg: '#1a1d2e',
          foreground: '#D1D5DB',
          hover: '#272a3f',
          active: '#6366F1',
        },
        border: '#1A1F2E',
      },
    },
  },
  plugins: [],
}
