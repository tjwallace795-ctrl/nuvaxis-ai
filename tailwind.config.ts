import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#f7f1e8",
        sand: "#efe4d2",
        caramel: "#b07a4a",
        cocoa: "#4a2e1d",
        espresso: "#2a1810",
        rose: "#c98b7a",
        gold: "#c9a066",
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(42, 24, 16, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
