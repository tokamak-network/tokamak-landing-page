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
        "550px": "550px",
        md: "800px",
        "price-md": "995px",
        "price-sm": "500px",
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
        "slide-up": "slide-up 1s ease-out",
        "slide-down": "slide-down 1s ease-out",
      },
      keyframes: {
        "infinite-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
