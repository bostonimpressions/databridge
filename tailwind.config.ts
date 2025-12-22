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
        'blue-ribbon': {
          500: '#286afa',
          700: '#1645ba',
        },
        apple: {
          500: '#54b244',
          600: '#47a137',
          700: '#328525',
        },
        sulu: {
          500: '#D2FF78',
          600: '#B5E660',
          700: '#8BBF43',
        },
        ultramarine: {
          500: '#020288',
          600: '#01017A',
          700: '#010166',
        },
        cloudburst: {
          500: '#1C2D50',
          600: '#172647',
          700: '#0F1C3B',
        },
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
