/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#E9F1F7",
        black: "#151515",
        gray: "#c6c6c6",
        "gray-dark": "#888888",
        "gray-light": "#dedede",
        // Brand colors
        primary: {
          DEFAULT: "#BC3908",
          dim: "#962d06",
        },
        secondary: {
          DEFAULT: "#F6AA1C",
          dim: "#c58816",
        },
        success: {
          DEFAULT: "#567335",
          dim: "#7a8f4a",
        },
        danger: {
          DEFAULT: "#a63d40",
          dim: "#8b3335",
        },
        // Text colors
        text: {
          dim: "#707070",
        },
      },
      borderWidth: {
        DEFAULT: "1px",
        0: "0",
        2: "2px",
        4: "4px",
        8: "8px",
      },
      borderRadius: {
        none: "0",
        sm: "2px",
        md: "4px",
        lg: "6px",
        gym: "0",
        DEFAULT: "0",
      },
      fontFamily: {
        gym: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      fontSize: {
        base: "16px",
        p: "16px",
        h6: "16px",
        h5: "16px",
        h4: "20px",
        h3: "24px",
        h2: "36px",
        h1: "48px",
      },
      boxShadow: {
        gym: "0 2px 8px 0 rgba(0, 0, 0, 0.8)",
        "gym-hover": "0 4px 16px 0 rgba(100, 148, 170, 0.25)",
        "gym-focus": "inset 0 0 0 2px rgba(100, 148, 170, 0.5)",
      },
    },
  },
  plugins: [],
};
