import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        portal: {
          green: '#97ce4c',
          'green-dark': '#6ea832',
        },
        rick: {
          blue: '#44281d',
          skin: '#f5d2a4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};

export default config;
