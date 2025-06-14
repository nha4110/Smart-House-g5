// tailwind.config.ts
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius, 0.5rem)",
        md: "calc(var(--radius, 0.5rem) - 2px)",
        sm: "calc(var(--radius, 0.5rem) - 4px)",
      },
      colors: {
        background: "var(--background, #ffffff)",
        foreground: "var(--foreground, #1e293b)",
        card: {
          DEFAULT: "var(--card, #ffffff)",
          foreground: "var(--card-foreground, #1e293b)",
        },
        popover: {
          DEFAULT: "var(--popover, #ffffff)",
          foreground: "var(--popover-foreground, #1e293b)",
        },
        primary: {
          DEFAULT: "var(--primary, #3b82f6)",
          foreground: "var(--primary-foreground, #ffffff)",
        },
        secondary: {
          DEFAULT: "var(--secondary, #bfdbfe)",
          foreground: "var(--secondary-foreground, #1e293b)",
        },
        muted: {
          DEFAULT: "var(--muted, #f1f5f9)",
          foreground: "var(--muted-foreground, #64748b)",
        },
        accent: {
          DEFAULT: "var(--accent, #10b981)",
          foreground: "var(--accent-foreground, #ffffff)",
        },
        destructive: {
          DEFAULT: "var(--destructive, #ef4444)",
          foreground: "var(--destructive-foreground, #ffffff)",
        },
        border: "var(--border, #e2e8f0)",
        input: "var(--input, #e2e8f0)",
        ring: "var(--ring, #3b82f6)",
        chart: {
          1: "var(--chart-1, #3b82f6)",
          2: "var(--chart-2, #10b981)",
          3: "var(--chart-3, #f59e0b)",
          4: "var(--chart-4, #ef4444)",
          5: "var(--chart-5, #8b5cf6)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background, #ffffff)",
          foreground: "var(--sidebar-foreground, #1e293b)",
          primary: "var(--sidebar-primary, #3b82f6)",
          "primary-foreground": "var(--sidebar-primary-foreground, #ffffff)",
          accent: "var(--sidebar-accent, #10b981)",
          "accent-foreground": "var(--sidebar-accent-foreground, #ffffff)",
          border: "var(--sidebar-border, #e2e8f0)",
          ring: "var(--sidebar-ring, #3b82f6)",
        },
        neutral: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
        },
        blue: {
          100: "#dbeafe",
          200: "#bfdbfe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e3a8a",
        },
        orange: {
          100: "#ffedd5",
          500: "#f97316",
        },
        green: {
          100: "#d1fae5",
          500: "#10b981",
        },
        purple: {
          100: "#f3e8ff",
          500: "#8b5cf6",
          700: "#6d28d9",
        },
        yellow: {
          100: "#fef3c7",
          500: "#f59e0b",
          700: "#b45309",
        },
        red: {
          500: "#ef4444",
        },
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate, typography],
};

export default config;
