/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        Jakarta: ["Jakarta-Regular"],
        "Jakarta-Bold": ["Jakarta-Bold"],
        "Jakarta-ExtraBold": ["Jakarta-ExtraBold"],
        "Jakarta-ExtraLight": ["Jakarta-ExtraLight"],
        "Jakarta-Light": ["Jakarta-Light"],
        "Jakarta-Medium": ["Jakarta-Medium"],
        "Jakarta-Regular": ["Jakarta-Regular"],
        "Jakarta-SemiBold": ["Jakarta-SemiBold"],
      },
    },
  },
  plugins: [],
};
