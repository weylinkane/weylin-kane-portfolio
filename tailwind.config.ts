import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surfaces
        background: "#0a0a0a",
        surface: "#111111",
        "surface-2": "#161616",
        border: {
          DEFAULT: "#1f1f1f",
          strong: "#2a2a2a",
        },
        // Text
        primary: "#fafafa",
        secondary: "#a3a3a3",
        muted: "#737373",
        // Semantic
        gain: "#34d399",
        loss: "#f87171",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        // Tighter heading scale for that quiet, professional feel
        display: ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "500" }],
      },
    },
  },
  plugins: [],
};

export default config;
