/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // New brand tokens requested by user
        brandYellow: '#EDA415',
        brandBlue: '#003F62',
        brandWhite: '#FFFFFF',
        brandDark: '#292D32',

        brandPrimary50: "#E6F6FF",
        brandPrimary100: "#BAE7FF",
        brandPrimary200: "#91D5FF",
        brandPrimary300: "#69C0FF",
        brandPrimary400: "#40A9FF",
        brandPrimary500: "#1890FF",
        brandPrimary600: "#096DD9",
        brandPrimary700: "#0050B3",
        brandPrimary800: "#003A8C",
        brandPrimary900: "#002766",

        brandSecondary50: "#FFF7E6",
        brandSecondary100: "#FFE7BA",
        brandSecondary200: "#FFD591",
        brandSecondary300: "#FFC069",
        brandSecondary400: "#FFA940",
        brandSecondary500: "#FA8C16",
        brandSecondary600: "#D46B08",
        brandSecondary700: "#AD4E00",
        brandSecondary800: "#873800",
        brandSecondary900: "#612500",

        textPrimary: "#0D0D0D",
        textSecondary: "#404040",
        surface: "#FFFFFF",
        surfaceAlt: "#F7F7F7",
        borderColor: "#DDDDDD"
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },

      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        pill: "999px"
      }
    }
  },
  plugins: []
};
