/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      ...colors,
      'custom-green-color': '#4c976f',
      'custom-brown-color': '#ecead3',
      'custom-blue-color': '#477187',
      'custom-blue-color-dark': '#164363',
      'custom-red-color': '#d5836b',
      'custom-color-dark': '#9fcfb9',
      'custom-grey-color': '#9d9789',
      'custom-exit-color': '#d84537',
    },
  },
  plugins: [],
}

// module.export = {
//   darkMode: 'class',
//   theme: {
//     extend: {
//       colors: {
//         primary: {"50":"#eff6ff","100":"#dbeafe","200":"#bfdbfe","300":"#93c5fd","400":"#60a5fa","500":"#3b82f6","600":"#2563eb","700":"#1d4ed8","800":"#1e40af","900":"#1e3a8a"}
//       }
//     },
//     fontFamily: {
//       'body': [
//     'Inter', 
//     'ui-sans-serif', 
//     'system-ui', 
//     '-apple-system', 
//     'system-ui', 
//     'Segoe UI', 
//     'Roboto', 
//     'Helvetica Neue', 
//     'Arial', 
//     'Noto Sans', 
//     'sans-serif', 
//     'Apple Color Emoji', 
//     'Segoe UI Emoji', 
//     'Segoe UI Symbol', 
//     'Noto Color Emoji'
//   ],
//       'sans': [
//     'Inter', 
//     'ui-sans-serif', 
//     'system-ui', 
//     '-apple-system', 
//     'system-ui', 
//     'Segoe UI', 
//     'Roboto', 
//     'Helvetica Neue', 
//     'Arial', 
//     'Noto Sans', 
//     'sans-serif', 
//     'Apple Color Emoji', 
//     'Segoe UI Emoji', 
//     'Segoe UI Symbol', 
//     'Noto Color Emoji'
//   ]
//     }
//   }
// }

