/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#121212',
          panel: '#1E1E1E',
          text: '#E0E0E0',
          accent: '#BB86FC',
          accent2: '#03DAC6',
        }
      }
    },
  },
  plugins: [],
}












