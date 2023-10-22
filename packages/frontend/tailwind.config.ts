import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [require("daisyui")],
  darkTheme: "mainUi",
  // DaisyUI theme colors
  daisyui: {
    themes: [

      {
        mainUi: {
          primary: "#2A195E",
          "primary-content": "#4DFFEB",
          secondary: "#34EEB6",
          "secondary-content": "#222222",
          accent: "#34EEB6",
          "accent-content": "#222222",
          neutral: "#F9FBFF",
          "neutral-content": "#385183",
          "base-100": "#666666",
          "base-200": "#40375C",
          "base-300": "#0F0921",

          "base-content": "#F9FBFF",
          info: "#33856B",
          success: "#34EEB6",
          warning: "#FFF772",
          error: "#FFBC63",


          ".tooltip": {
            "--tooltip-tail": "6px",
          },
        },
      },
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        "bai-jamjuree": ["Bai Jamjuree", "sans-serif"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        red: "red"
      },
      spacing: {
        '128': '32rem',
        '130': '36rem',
        '132': '37rem',
      }
    },
  },
}
export default config
