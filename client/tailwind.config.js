/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        telkom: {
          red: '#E31E24',
          dark: '#1A1A1A',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};