module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Include all your React components
  ],
  theme: {
    extend: {
      colors: {
        customPurple: {
          500: '#191023',
          700: '#191023',
        },
        customTeal:{        
          500: '#1bc597',
          700: '#1bc597',
          600: '#00c7fe',
        },
        customBlack:{
          500 : '#253239',
          700 : '#253239',
          100 : '#1d2a35',
        },
        customBlue:{
          100 : '#282a35',
        },
        customGreen:{
          100 : '#04aa6d',
        },
        chatBot:{
          100 : '#1c4b57',
          200 : '#0b9cff',
        },
      },
    },
  },
  plugins: [],
}
