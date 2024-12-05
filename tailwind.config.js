/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui'), require('tailwindcss-animated')],
  daisyui: {
    themes: [
      'luxury',
      {
        'luxury-light': {
          primary: '#ca8a04',
          secondary: '#e5e7eb',
          accent: '#F6DCCE',
          neutral: '#F1E8E2',
          'base-100': '#f5f5f4',
          info: '#93c5fd',
          success: '#a3e635',
          warning: '#fde047',
          error: '#ef4444'
        }
      }
    ]
  }
};
