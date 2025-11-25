/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      colors: {
        lab: {
          background: "#0c0f13",
          surface: "#11151d",
          neon: {
            blue: "#38bdf8",
            green: "#34d399",
            purple: "#a855f7"
          }
        }
      },
      boxShadow: {
        neon: "0 0 20px rgba(56, 189, 248, 0.35)"
      }
    },
  },
  plugins: [],
}

