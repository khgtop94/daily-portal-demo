import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f3f6fb",
          100: "#e2ebf5",
          200: "#c4d6ea",
          300: "#9bb8d8",
          400: "#6b94c2",
          500: "#3b6db1",
          600: "#2f5a98",
          700: "#274d83",
          800: "#1f3d6a",
          900: "#15294a",
        },
        accent: {
          500: "#10b981",
          600: "#059669",
        },
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "Helvetica Neue",
          "Segoe UI",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "Malgun Gothic",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
