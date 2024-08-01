import cjs from "@peggyjs/eslint-config/flat/cjs.js";
import mocha from "@peggyjs/eslint-config/flat/mocha.js";
import mod from "@peggyjs/eslint-config/flat/module.js";

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
  {
    languageOptions: {
      ecmaVersion: 2022,
    },
    rules: {
      "no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^(_|ignore)",
        destructuredArrayIgnorePattern: "^_",
        varsIgnorePattern: "^_[^_]",
        reportUsedIgnorePattern: true,
      }],
    },
  },
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
