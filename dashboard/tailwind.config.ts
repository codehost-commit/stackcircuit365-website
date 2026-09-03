import type { Config } from "tailwindcss";

/* Same design tokens as the marketing site, so the dashboard is one brand. */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0c0e",
        green: "#0a1c12",
        paper: "#f7f7f4",
        card: "#ffffff",
        line: "#d9d9d2",
        line2: "#e7e7e0",
        muted: "#5c5f66",
        signal: "#0f7a3d",
        alert: "#b42318",
        amber: "#a15c00",
        warn: "#c98a00"
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
export default config;
