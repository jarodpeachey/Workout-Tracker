/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0d0d0d',
          card: '#1a1a1a',
          lighter: '#252525',
          border: '#2a2a2a',
        },
        accent: {
          blue: '#3b82f6',
          'blue-dim': '#2563eb',
        },
        text: {
          primary: '#ffffffF2',
          secondary: '#b0b0b0',
          dim: '#707070',
        },
      },
      borderRadius: {
        'none': '0',
        'gym': '0',
        DEFAULT: '0',
      },
      fontFamily: {
        gym: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        gym: '0 2px 8px 0 rgba(0, 0, 0, 0.8)',
        'gym-hover': '0 4px 16px 0 rgba(59, 130, 246, 0.25)',
        'gym-focus': 'inset 0 0 0 2px rgba(59, 130, 246, 0.5)',
      },
    },
  },
  plugins: [],
}