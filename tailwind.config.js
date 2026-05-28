/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        care: "#10B981",
        surface: "#F8FAFC",
        ink: "#1E293B",
        muted: "#64748B",
        warm: "#F59E0B",
        attention: "#EF4444"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};
