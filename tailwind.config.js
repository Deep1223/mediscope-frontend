/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ayushveda-primary': '#059669',
        'ayushveda-secondary': '#10b981',
        'ayushveda-accent': '#f59e0b',
        'ayushveda-dark': '#111827',
        'ayushveda-light': '#f0fdf4',
        'ayushveda-gray': '#f9fafb',
        'ayushveda-border': '#d1d5db',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

