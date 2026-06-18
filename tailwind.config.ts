import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mirror: {
          bg: '#0A0D10',
          panel: '#11161C',
          border: '#26303A',
          text: '#E8EDF2',
          muted: '#91A0AE',
          accent: '#2DD4BF',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
