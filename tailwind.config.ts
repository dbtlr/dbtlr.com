import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      inherit: colors.inherit,
      transparent: colors.transparent,
      rose: colors.transparent,
      pink: colors.pink,
      fuchsia: colors.fuchsia,
      purple: colors.purple,
      violet: colors.violet,
      indigo: colors.indigo,
      blue: colors.blue,
      cyan: colors.cyan,
      teal: colors.teal,
      emerald: colors.emerald,
      green: colors.green,
      lime: colors.lime,
      yellow: colors.yellow,
      amber: colors.amber,
      red: colors.red,
      stone: colors.stone,
      neutral: colors.neutral,
      zinc: colors.zinc,
      gray: colors.gray,
      slate: colors.slate,
      white: colors.white,
      black: colors.black,
      accent: '#ec4899',
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;
