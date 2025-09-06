/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // This ensures Tailwind can purge unused styles
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3836bd',      
        secondary: '#f47500',    
        accent: '#7AC6D2',       
        white: '#ffffff',  
        lightgray: '#F9F9F9',    // Very light gray for background
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
      },
      borderRadius: {
        'xl': '1rem',
      },
      boxShadow: {
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 30px rgba(0, 0, 0, 0.1)',
      },
      fontFamily:{
        'circle' : "Balsamiq Sans"
      }
    },
  },
  plugins: [],
}
