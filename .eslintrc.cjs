"use strict";

module.exports = {
  root: true,
  extends: ["@peggyjs"],
  ignorePatterns: [
    "docs/",
    "node_modules/",
  ],
  overrides: [
    {
      files: ["*.js"],
      parserOptions: {
        sourceType: "module",
        ecmaVersion: 2022,
      },
      rules: {
        "no-eq-null": "off",
        "eqeqeq": ["error", "always", { "null": "ignore" }],
        "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      },
    },
    {
      files: ["test/*.js"],
      env: {
        mocha: true,
      },
    },
  ],
};
