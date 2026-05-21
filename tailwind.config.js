/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4ade80",
        secondary: "#f0e8d0",
        accent: "#4ade80",
        surface: "#f0e8d0",
      },
      fontFamily: {
        heading: ["Bebas Neue", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
