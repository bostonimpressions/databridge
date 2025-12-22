import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sapphire: {
          500: '#3f51b5',
          700: '#2c387e',
        },
        perano: {
          200: '#e0e4ff',
          300: '#c0c5ff',
          500: '#7f8cff',
        },
        biscay: {
          600: '#2b3a4d',
        },
        magenta: {
          100: '#F6C3D0',
          300: '#D05E66',
          500: '#A4103B',
        },
      },
    },
  },
};

export default config;
