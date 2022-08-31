/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '2048'
      },
      borderWidth: {
        DEFAULT: '1.5px',
      },
      lineHeight: {
        '11': '2.75rem',
      },
      boxShadow: {
        smooth: '0px 0px 12px 9px #00000008'
      }
    }
  },
  plugins: [],
}
