# ======= tailwind.config.ts =======
import type { Config } from 'tailwindcss';


export default {
content: [
'./app/**/*.{ts,tsx}',
'./components/**/*.{ts,tsx}',
'./pages/**/*.{ts,tsx}',
'./src/**/*.{ts,tsx}',
'./*.{ts,tsx,html}',
],
theme: {
extend: {},
},
plugins: [],
} satisfies Config;

