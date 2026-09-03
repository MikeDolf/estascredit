import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx,md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B0F",
        paper: "#F6F5F1",
        mist: "#ECEAE3",
        brand: {
          DEFAULT: "#5B4BFF",
          ink: "#2A1F99",
          soft: "#EEEBFF",
        },
        accent: "#FFE27A",
      },
      fontFamily: {
        // Через CSS-переменные: каждый root-layout подставляет свой набор
        // (Bricolage/Inter для Plumbing Co, Manrope/Inter с кириллицей для УралФорклифта).
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.035em",
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,11,15,0.04), 0 12px 32px -12px rgba(11,11,15,0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
