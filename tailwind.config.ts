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
        stellarnight: {
          50: '#F5F7FA',
          100: '#E9EDF3',
          200: '#D2DBE8',
          300: '#AAB9D0',
          400: '#7C8FB8',
          500: '#5A70A1',
          600: '#3D5381',
          700: '#2A3E63',
          800: '#1C2D50',
          900: '#15223A',
          950: '#10192D',
        },
        magenta: {
          100: '#F6C3D0',
          300: '#D05E66',
          500: '#A4103B',
        },
        orange: {
          500: '#D65A20',
        },
      },
    },
  },
};

export default config;
