/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['"Fredoka One"', 'cursive'],
      },
      keyframes: {
        bounce_animal: {
          '0%':   { transform: 'translateY(0) scale(1)' },
          '30%':  { transform: 'translateY(-24px) scale(1.2) rotate(-6deg)' },
          '60%':  { transform: 'translateY(-10px) scale(1.1) rotate(4deg)' },
          '80%':  { transform: 'translateY(-4px) scale(1.05)' },
          '100%': { transform: 'translateY(0) scale(1)' },
        },
        pop: {
          '0%':   { transform: 'scale(1)' },
          '40%':  { transform: 'scale(1.35)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        bounce_animal: 'bounce_animal 0.55s cubic-bezier(0.36,0.07,0.19,0.97)',
        pop: 'pop 0.25s ease-out',
      },
    },
  },
  plugins: [],
}
