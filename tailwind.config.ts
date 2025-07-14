import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Hardcoded colors for gradients and specific elements
        "blue-50": "#e0f2fe",
        "blue-300": "#93c5fd",
        "blue-400": "#60a5fa",
        "blue-500": "#3b82f6",
        "blue-600": "#2563eb",
        "purple-50": "#f3e8ff",
        "purple-300": "#d8b4fe",
        "purple-400": "#c084fc",
        "purple-500": "#a855f7",
        "purple-600": "#9333ea",
        "green-50": "#f0fdf4",
        "green-300": "#86efac",
        "green-400": "#4ade80",
        "green-500": "#22c55e",
        "green-600": "#16a34a",
        "orange-50": "#fff7ed",
        "orange-300": "#fdba74",
        "orange-400": "#fb923c",
        "orange-500": "#f97316",
        "orange-600": "#ea580c",
        "pink-50": "#fdf2f8",
        "pink-300": "#fbcfe8",
        "pink-400": "#f472b6",
        "pink-500": "#ec4899",
        "pink-600": "#db2777",
        "indigo-500": "#6366f1",
        "emerald-500": "#10b981",
        "violet-500": "#8b5cf6",
        "amber-500": "#f59e0b",
        "cyan-500": "#06b6d4",
        "rose-500": "#f43f5e",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { transform: "translateY(100%)" },
          "20%,50%": { transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.2s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        blob: "blob 7s infinite cubic-bezier(0.6, 0.01, 0.3, 0.9)",
        "bounce-once": "bounce 1s 1", // For the initial bounce of the button
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
