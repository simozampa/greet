/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        creator: {
          DEFAULT: '#5CC5F3',
          50: '#ECF8FE',
          100: '#F4FBFE',
          200: '#CEEEFB',
          300: '#A8E0F9',
          400: '#82D3F6',
          500: '#5CC5F3',
          600: '#28B2EF',
          700: '#0F95D0',
          800: '#0B6F9B',
          900: '#084A67',
          950: '#06374D'
        },
        business: {
          DEFAULT: '#D13181',
          50: '#FBEEF5',
          100: '#EFB6D3',
          200: '#E795BE',
          300: '#E074AA',
          400: '#D85295',
          500: '#D13181',
          600: '#A52565',
          700: '#771B49',
          800: '#49102D',
          900: '#1B0611',
          950: '#050103'
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        logo: ['HelveticaNueue']
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    function ({ addBase, theme }) {
      function extractColorVars(colorObj, colorGroup = '') {
        return Object.keys(colorObj).reduce((vars, colorKey) => {
          const value = colorObj[colorKey];

          const newVars =
            typeof value === 'string'
              ? { [`--color${colorGroup}-${colorKey}`]: value }
              : extractColorVars(value, `-${colorKey}`);

          return { ...vars, ...newVars };
        }, {});
      }

      addBase({
        ':root': extractColorVars(theme('colors')),
      });
    },

  ],
}
