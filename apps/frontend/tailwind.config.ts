import { defineConfig } from 'tailwindcss';

export default defineConfig({
    theme: {
        extend: {
            colors: {
                primary: '#F1F1F1', // Background web page color
                secondary: '#012D5A', // Textbox for headings
                accent: '#FBBF24', // Your accent color
                background: '#F9FAFB', // Your background color
            },
            fontFamily: {
                sans: ['Helvetica', 'Arial', 'sans-serif'], // Your selected sans-serif fonts
                serif: ['Georgia', 'serif'], // Your selected serif fonts
                mono: ['Menlo', 'monospace'], // Your selected monospace fonts
            },
        },
    },
    variants: {},
    plugins: [],
});