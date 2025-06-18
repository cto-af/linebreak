import mod from "@peggyjs/eslint-config/module.js";
import modern from "@peggyjs/eslint-config/modern.js";

export default [
  {
    ignores: [
      "coverage/**",
      "docs/**",
      "dist/**",
      "node_modules/**",
      "**/*.d.ts",
    ],
  },
  ...mod,
  ...modern,
  {
    files: [
      "lib/EastAsianWidth.js",
      "lib/LineBreak.js",
    ],
    rules: {
      "@stylistic/object-curly-spacing": "off",
    },
  },
];
