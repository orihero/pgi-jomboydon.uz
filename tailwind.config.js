/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4B83F2',
        'primary-dark': '#3A67C2',
        'gray-text': '#667085',
        'gray-label': '#344054',
        'gray-border': '#D0D5DD',
        'gray-bg': '#F9FAFB',
      }
    },
  },
  plugins: [],
} 