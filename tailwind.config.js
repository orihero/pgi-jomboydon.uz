/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B1D1D',
        'primary-dark': '#701717',
        'gray-text': '#667085',
        'gray-label': '#344054',
        'gray-border': '#D0D5DD',
        'gray-bg': '#F9FAFB',
      }
    },
  },
  plugins: [],
} 