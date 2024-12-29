import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        md: "800px",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        black: "#1C1C1C",
        "tokamak-blue": "#0078FF",
        "tokamak-black": "#1C1C1C",
      },
      fontFamily: {
        sans: ["Proxima Nova", ...fontFamily.sans],
      },
      animation: {
        "infinite-scroll": "infinite-scroll 15s linear infinite",
      },
      keyframes: {
        "infinite-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
