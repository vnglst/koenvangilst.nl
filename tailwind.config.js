const { spacing, fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} \*/
module.exports = {
  mode: 'jit',
  content: ['./app/**/*.tsx', './components/**/*.tsx', './styles/**/*.css'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#5bc3eb'
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans]
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            a: {
              color: '#53ceff',
              '&:hover': {
                color: theme('colors.blue.300')
              },
              code: { color: '#53ceff' }
            },
            'h2,h3,h4': {
              'scroll-margin-top': spacing[32]
            },
            code: { color: theme('colors.gray.700') },
            'blockquote p:first-of-type::before': false,
            'blockquote p:last-of-type::after': false
          }
        },
        dark: {
          css: {
            color: theme('colors.gray.200'),
            a: {
              color: '#53ceff',
              '&:hover': {
                color: theme('colors.blue.300')
              },
              code: { color: '#53ceff' }
            },
            blockquote: {
              borderLeftColor: theme('colors.gray.700'),
              color: theme('colors.gray.300')
            },
            'h2,h3,h4': {
              color: theme('colors.gray.100'),
              'scroll-margin-top': spacing[32]
            },
            hr: { borderColor: theme('colors.gray.700') },
            ol: {
              li: {
                '&:before': { color: theme('colors.gray.500') }
              }
            },
            ul: {
              li: {
                '&:before': { backgroundColor: theme('colors.gray.500') }
              }
            },
            code: { color: theme('colors.gray.300') },
            strong: { color: theme('colors.gray.100') }
          }
        }
      })
    }
  },
  variants: {
    typography: ['dark']
  },
  plugins: [require('@tailwindcss/typography')]
};
