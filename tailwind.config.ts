import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F5F3F0',
        surface: '#FFFFFF',
        'surface-soft': '#FAF9F7',
        primary: '#1B5E3F',
        'primary-light': '#2A7A52',
        'primary-dark': '#0E3D28',
        secondary: '#0A7BA7',
        'secondary-light': '#1B94C0',
        'secondary-dark': '#055A7E',
        accent: '#C97A5C',
        'accent-light': '#E8956B',
        'accent-dark': '#A85D42',
        text: '#1A1A1A',
        muted: '#7F7F7F',
        border: '#E5E3E0',
        'border-light': '#F0EFED',
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Poppins', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'safe': 'max(1rem, env(safe-area-inset-bottom))',
      },
      borderRadius: {
        lg: '0.875rem',
        xl: '1.125rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'base': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [animate],
} satisfies Config

export default config
