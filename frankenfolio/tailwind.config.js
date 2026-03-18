/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Critical for our Dark Mode toggle!
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        experiment: "#39FF14", // Our signature "Toxic Green"
        labDark: "#0a0a0a",    // Deep laboratory black
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}