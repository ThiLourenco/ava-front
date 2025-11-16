import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        card: "var(--card)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        success: "var(--success)",
        "success-foreground": "var(--success-foreground)",
        danger: "var(--danger)",
        "danger-foreground": "var(--danger-foreground)",
        warning: "var(--warning)",
        "warning-foreground": "var(--warning-foreground)",
        info: "var(--info)",
        "info-foreground": "var(--info-foreground)",
        border: "var(--border)",
        input: "var(--input)",
        "input-foreground": "var(--input-foreground)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
      },
      boxShadow: {
        DEFAULT: "var(--shadow)",
      },
    },
  },
  plugins: [],
};

export default config;
