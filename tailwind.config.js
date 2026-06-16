/** @type {import('tailwindcss').Config} */
export default {
  // Only the React app — public/*.html (legacy Core) ships its own CDN Tailwind.
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
