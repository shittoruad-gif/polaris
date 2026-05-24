import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { ink: '#0b1a2b', gold: '#c8a45c', cream: '#fbf7ef' },
      fontFamily: {
        sans: ['"Hiragino Sans"','"Yu Gothic"','system-ui','sans-serif'],
        serif: ['"Hiragino Mincho ProN"','"Yu Mincho"','serif'],
      },
    },
  },
  plugins: [],
};
export default config;
