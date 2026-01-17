/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['DM Sans', 'sans-serif'],
                serif: ['Libre Baskerville', 'serif'],
            },
            colors: {
                background: '#0a0a0a',
                foreground: '#ededed',
                primary: {
                    DEFAULT: '#ffffff',
                    foreground: '#000000'
                },
                muted: {
                    DEFAULT: '#262626',
                    foreground: '#a3a3a3'
                },
                accent: {
                    DEFAULT: '#3b82f6', // Subtle blue accent commonly seen in AI tools
                    foreground: '#ffffff'
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
