/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["selector", '[data-mode="dark"]'],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      textColor: ["group-hover"], // Enable group-hover for text color utilities
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("daisyui")],
};
