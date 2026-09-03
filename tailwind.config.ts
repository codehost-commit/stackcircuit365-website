import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0c0e",
        paper: "#f7f7f4",
        card: "#ffffff",
        line: "#d9d9d2",
        line2: "#e7e7e0",
        muted: "#5c5f66",
        signal: "#0f7a3d",
        alert: "#b42318",
        amber: "#a15c00"
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      },
      borderRadius: {
        none: "0"
      }
    }
  },
  plugins: []
};
export default config;
