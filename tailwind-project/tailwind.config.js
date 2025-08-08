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
        customblue: '#475E74',
        custompurple: '#4C587C',
        mygreen: '#07453A',
        mypurple: '#1C2C58',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
