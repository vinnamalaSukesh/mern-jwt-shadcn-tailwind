/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        screens :{
            xxs : '350px',
            xs : '500px',
            sm : '650px',
            md : '800px',
            lg : '1000px',
            xl : '1200px',
            xxl : '1400px'
        },
        extend: {},
    },
    plugins: [],
};
