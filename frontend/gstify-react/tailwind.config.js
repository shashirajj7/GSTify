/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#137fec",
        "secondary": "#617589",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
        "t_navy": "#0A192F",
      },
      fontFamily: {
        "sans": ["Inter", "SF Pro Display", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Manrope", "sans-serif"],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
