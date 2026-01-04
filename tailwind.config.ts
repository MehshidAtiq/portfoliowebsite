import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "deep-purple": "#0a0514",
        "card-purple": "#1a0b2e",
        "glow-purple": "#a855f7",
      },
      animation: {
        "glow-pulse": "glow-pulse 2s infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 5px #a855f7, 0 0 10px #a855f7" },
          "50%": { boxShadow: "0 0 20px #a855f7, 0 0 30px #a855f7" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
