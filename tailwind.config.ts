export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        redCross: '#d62828',
        redCrossLight: '#e63946',
      },
      fontSize: {
        sm: '0.95rem',
        base: '1.05rem',
        lg: '1.175rem',
        xl: '1.325rem',
        '2xl': '1.65rem',
        '3xl': '1.95rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      keyframes: {
        fadeInOut: {
          '0%, 100%': { opacity: 0 },
          '10%, 90%': { opacity: 1 },
        },
        pulseOnce: {
          '0%': { backgroundColor: '#fef08a' }, // yellow-100
          '50%': { backgroundColor: '#fde68a' }, // yellow-200
          '100%': { backgroundColor: '#fff' },
        }
      },
      animation: {
        'fade-in-out': 'fadeInOut 2s ease-in-out',
        'pulse-once': 'pulseOnce 1.5s ease-in-out',
      }
    }
  },
  plugins: [],
};
