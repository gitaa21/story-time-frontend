/** @type {import('tailwindcss').Config} */
export default {
  content: 
  [
  './components/**/*.{vue,js,ts}',
  './layouts/**/*.vue',
  './pages/**/*.vue',
  './composables/**/*.{js,ts}',
  './plugins/**/*.{js,ts}',
  './app.vue',],
  theme: {
    extend: {
      fontFamily: {
        'dm-sans': ['DM Sans', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif'],
      },
      colors: {
        'raisin-black' : '#222222',
        'quartz' : '#4B4B4B',
        'gray-asparagus' : '#466543',
        'issabelline' : '#F0F5ED',
        
      },
    },
  },
  plugins: [],
}

