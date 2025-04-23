import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/app/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        base: {
          DEFAULT: "#bac1c7", 
          light: "#d1d5d9",
          dark: "#9ba5ae",
        },
        neutral: {
          100: "#f9fafb",
          200: "#e5e7eb",
          300: "#d1d5db",
          900: "#111827",
        },
        accent: {
          DEFAULT: "#5d5f71",
          hover: "#85879b",
        },
        success: "#22c55e",
        error: "#ef4444",
      },
    },
  },
  plugins: [],
} satisfies Config;
