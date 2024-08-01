import cjs from "@peggyjs/eslint-config/flat/cjs.js";
import mocha from "@peggyjs/eslint-config/flat/mocha.js";
import mod from "@peggyjs/eslint-config/flat/module.js";
import modern from "@peggyjs/eslint-config/flat/modern.js";

export default [
  {
    ignores: [
      "coverage/**",
      "docs/**",
      "node_modules/**",
      "**/*.d.ts",
    ],
  },
  mod,
  modern,
  cjs,
  mocha,
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
