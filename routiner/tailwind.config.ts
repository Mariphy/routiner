import type { Config } from "tailwindcss";
import flowbiteReact from "flowbite-react/plugin/tailwindcss";

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/app/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ".flowbite-react\\class-list.json"
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
          100: "#f8fafc",  // cool off-white
          200: "#F2F0EF",  // slate-100
          300: "#cbd5e1",  // slate-200
          900: "#0f172a",  // slate-900 (dark navy-gray)
        },
        accent: {
          DEFAULT: "#5d5f71", //buttons, NavBar
          hover: "#85879b",
        },
        success: "#22c55e",
        error: "#ef4444",
      },
    },
  },
  plugins: [flowbiteReact],
} satisfies Config;