/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Убедись, что здесь указаны правильные пути к твоим компонентам
  ],
  theme: {
    extend: {
      rotate: {
        180: "180deg",
      },
    },
  },
  plugins: [],
};
