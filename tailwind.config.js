/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      textColor: ['group-hover'], // Enable group-hover for text color utilities
    },
  },
  plugins: [require("daisyui")],
}

