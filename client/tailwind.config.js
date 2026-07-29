/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        void: "#050607",
        carbon: "#0a0c0e",
        graphite: "#111418",
        gunmetal: "#191d22",
        steel: "#242a31",
        silver: "#c7cbd1",
        platinum: "#f2f4f6",
        chrome: "#e7e9ec",
        muted: "#888e97",
        gold: "#d6ad58"
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"]
      },
      boxShadow: {
        chrome: "0 18px 70px rgba(0,0,0,.55), inset 0 1px rgba(255,255,255,.08)",
        panel: "0 20px 70px rgba(0,0,0,.34)"
      },
      backgroundImage: {
        chrome: "linear-gradient(135deg,#f6f7f8 0%,#9ea4ac 42%,#eef0f2 74%,#777e87 100%)",
        "dark-metal": "linear-gradient(145deg,#1a1e23 0%,#0b0d0f 48%,#15191e 100%)"
      },
      keyframes: {
        pulseRing: {
          "0%": { transform: "scale(.82)", opacity: ".75" },
          "80%,100%": { transform: "scale(1.35)", opacity: "0" }
        },
        shimmer: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(220%)" }
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        }
      },
      animation: {
        "pulse-ring": "pulseRing 1.8s ease-out infinite",
        shimmer: "shimmer 2.8s ease-in-out infinite",
        float: "float 4.8s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
