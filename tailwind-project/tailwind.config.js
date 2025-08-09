/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "../index.html",
    "../script.js",
    "./src/**/*.{html,js}" // sirf src folder ke andar ki files ko match karo
  ],
  theme: {
    extend: {
      colors: {
        customblue: '#292F6F',
        custompurple: '#4C587C',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
