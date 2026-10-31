/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Government Emergency Dashboard Color Theme
        // Primary Amber: #D99A36
        primary: {
          50: '#FDF8F0',
          100: '#FBF0E0',
          200: '#F6DEC0',
          300: '#F0CCA0',
          400: '#E5B368',
          500: '#D99A36', // Primary Amber
          600: '#C28325',
          700: '#9E6717',
          800: '#7B4D0F',
          900: '#5A3608',
        },
        amber: {
          50: '#FFFDF5',
          100: '#FEF9E7',
          200: '#FDF0C5',
          300: '#FBE49D',
          400: '#F5CE62',
          500: '#D99A36', // Primary Amber
          600: '#B87B20',
          700: '#8C5A14',
          800: '#66400B',
          900: '#402705',
        },
        // Main Background: Light Grey (#F3F4F6)
        // Cards: White (#FFFFFF)
        // Text: Dark Grey (#374151)
        // Borders: Light Grey (#E5E7EB)
        gov: {
          bg: '#F3F4F6',
          card: '#FFFFFF',
          text: '#374151',
          heading: '#1F2937',
          muted: '#6B7280',
          border: '#E5E7EB',
          accent: '#D99A36',
          softAccent: '#FEF3C7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
