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
        gradient:"linear-gradient(228deg, #066141 -0.2%, #21275E -0.19%, #044836 99.99%);",

      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
