import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                display: ['Instrument Serif', 'Georgia', 'serif'],
                body: ['DM Sans', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                dark: {
                    void: '#080a0e',
                    base: '#0d1117',
                    surface: '#141b24',
                    elevated: '#1c2433',
                    overlay: '#243041',
                },
                gold: {
                    warm: '#c9a84c',
                    bright: '#f0c040',
                    muted: '#8a7040',
                },
                status: {
                    validated: '#2ecc8e',
                    pending: '#e8a840',
                    rejected: '#e05c5c',
                    info: '#4a90d9',
                },
                text: {
                    primary: '#e8ecf0',
                    secondary: '#8a9bb0',
                    muted: '#4a5568',
                    gold: '#c9a84c',
                },
                border: {
                    default: 'rgba(255, 255, 255, 0.10)',
                    subtle: 'rgba(255, 255, 255, 0.06)',
                    gold: 'rgba(201, 168, 76, 0.30)',
                }
            },
            boxShadow: {
                card: '0 1px 3px rgba(0, 0, 0, 0.5), 0 4px 20px rgba(0, 0, 0, 0.4)',
                gold: '0 0 40px rgba(201, 168, 76, 0.12)',
                elevated: '0 8px 40px rgba(0, 0, 0, 0.6)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gold-thin': 'linear-gradient(to right, transparent, #c9a84c, transparent)',
            },
            animation: {
                'shimmer': 'shimmer 2s linear infinite',
                'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' }
                }
            }
        },
    },
    plugins: [require("tailwindcss-animate")],
}
export default config
