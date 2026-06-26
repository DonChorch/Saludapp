/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7B6FAD",
        primarySoft: "#F3F0FB",
        primaryTint: "#D9D4EF",
        care: "#5A8B78",
        careDeep: "#3F6E5B",
        careSoft: "#EBF4F0",
        careTint: "#B8DAC8",
        surface: "#F7F6F3",
        paper: "#FBFAF7",
        ink: "#2A2938",
        muted: "#6B6A80",
        warm: "#C47A2B",
        warmSoft: "#FBF4EC",
        attention: "#B8574A",
        attentionSoft: "#F8EDEA",
        line: "rgba(42, 41, 56, 0.08)"
      },
      boxShadow: {
        soft: "0 18px 44px rgba(60, 50, 100, 0.10)",
        phone: "0 40px 100px rgba(60, 50, 100, 0.22), 0 4px 20px rgba(60, 50, 100, 0.12)"
      }
    }
  },
  plugins: []
};
