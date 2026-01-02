/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Apple-inspired dark blue theme palette
        apple: {
          dark: {
            bg: "#0a1628", // Deep dark blue background
            surface: "#0f1e35", // Elevated surface
            elevated: "#15243f", // More elevated surface
            card: "#15243f", // Card background
            border: "#1e2f4a", // Borders
            divider: "#253a54", // Dividers
          },
          blue: {
            50: "#e6f0ff",
            100: "#b3d5ff",
            200: "#80baff",
            300: "#4d9fff",
            400: "#1a84ff",
            500: "#0069e6", // Primary blue
            600: "#0052b3",
            700: "#003b80",
            800: "#00244d",
            900: "#000d1a",
          },
          gray: {
            50: "#f5f7fa",
            100: "#e8ecf0",
            200: "#d1d9e1",
            300: "#a3b3c3",
            400: "#758da5",
            500: "#476787",
            600: "#395269",
            700: "#2b3d4b",
            800: "#1d282e",
            900: "#0f1417",
          },
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          "system-ui",
          "sans-serif",
        ],
      },
      fontSize: {
        display: [
          "80px",
          { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "600" },
        ],
        "display-sm": [
          "56px",
          { lineHeight: "1.07", letterSpacing: "-0.02em", fontWeight: "600" },
        ],
        headline: [
          "40px",
          { lineHeight: "1.1", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "headline-sm": [
          "32px",
          { lineHeight: "1.125", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        title: [
          "28px",
          { lineHeight: "1.14", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "title-sm": [
          "22px",
          { lineHeight: "1.27", letterSpacing: "0", fontWeight: "600" },
        ],
        body: [
          "17px",
          { lineHeight: "1.47", letterSpacing: "-0.01em", fontWeight: "400" },
        ],
        "body-sm": [
          "15px",
          { lineHeight: "1.47", letterSpacing: "-0.01em", fontWeight: "400" },
        ],
        caption: [
          "13px",
          { lineHeight: "1.38", letterSpacing: "0", fontWeight: "400" },
        ],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
        34: "8.5rem",
      },
      borderRadius: {
        apple: "18px",
        "apple-lg": "20px",
        "apple-xl": "24px",
      },
      boxShadow: {
        apple: "0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)",
        "apple-md":
          "0 4px 16px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)",
        "apple-lg":
          "0 8px 32px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.4)",
        "apple-xl":
          "0 16px 64px rgba(0, 0, 0, 0.6), 0 8px 16px rgba(0, 0, 0, 0.5)",
        "apple-inset": "inset 0 1px 2px rgba(0, 0, 0, 0.3)",
        "apple-glow": "0 0 20px rgba(0, 105, 230, 0.15)",
        "apple-glow-md": "0 0 30px rgba(0, 105, 230, 0.2)",
      },
      backdropBlur: {
        apple: "20px",
        "apple-lg": "40px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
