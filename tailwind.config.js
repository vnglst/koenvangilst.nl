import typography from '@tailwindcss/typography';
import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
const config = {
  mode: 'jit',
  content: ['./app/**/*.tsx', './components/**/*.tsx', './styles/**/*.css'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#2196f3'
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        fraunces: ['var(--font-fraunces)', 'serif']
      }
    }
  },
  plugins: [typography]
};

export default config;
