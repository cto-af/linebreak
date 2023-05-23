'use strict';

module.exports = {
  root: true,
  extends: ['@peggyjs'],
  ignorePatterns: [
    'docs/',
    'node_modules/',
  ],
  overrides: [
    {
      files: ['*.js', '*.cjs'],
      rules: {
        'no-eq-null': 'off',
        'eqeqeq': ['error', 'always', { 'null': 'ignore' }],
        'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
        'quotes': ['error', 'single', { avoidEscape: true }],
      },
    },
    {
      files: ['*.js'],
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2022,
      },
    },
    {
      files: ['test/*.js'],
      env: {
        mocha: true,
      },
      rules: {
        'prefer-arrow-callback': 'off',
      },
    },
  ],
};
