/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors:{
        brown:{
          500:'#A0522D',
        }
      }
    },
  },
  plugins: [],
}

