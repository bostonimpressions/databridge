import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
//   theme: {
//     extend: {
//       // FIX: All custom colors are now correctly placed within 'extend'
//       // This ensures the default color palette is preserved, fixing the compilation error.
//       colors: {
//         // Redefining 'gray' only if needed, otherwise it's inherited. 
//         // We'll keep it explicit here for now based on your previous config:
//         'gray': {
//           50: '#f9fafb',
//           100: '#f3f4f6',
//           200: '#e5e7eb',
//           300: '#d1d5db',
//           400: '#9ca3af',
//           500: '#6b7280',
//           600: '#4b5563',
//           700: '#374151',
//           800: '#1f2937',
//           900: '#111827',
//           950: '#030712',
//         },

//         // OVERWRITING default 'blue' while preserving other colors
//         'blue': {
//           '50': '#eff6ff',
//           '100': '#dbeafe',
//           '200': '#bfdbfe',
//           '300': '#93c5fd',
//           '400': '#60a5fa',
//           '500': '#1f487e', // <-- Your Primary Brand Blue (e.g., bg-blue-500)
//           '600': '#2563eb', 
//           '700': '#1d4ed8',
//           '800': '#1e40af',
//           '900': '#1e3a8a',
//           '950': '#172554',
//         },

//         // NEW COLOR: 'dark-blue'
//         'dark-blue': {
//           '50': '#f5f7f9',
//           '100': '#ebf0f5',
//           '200': '#c9d8e3',
//           '300': '#a2bcd1',
//           '400': '#7195af',
//           '500': '#4a6f87', // <-- Your Custom Darker Shade
//           '600': '#39576b',
//           '700': '#2a4150',
//           '800': '#1c2b35',
//           '900': '#0f171b',
//           '950': '#070b0d',
//         },
        
//         'accent-green': '#38a169',
//       },
//     },
//   },
  plugins: [],
};

export default config;