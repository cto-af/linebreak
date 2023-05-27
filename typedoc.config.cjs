'use strict';

/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPoints: [
    './lib/index.js',
    './lib/break.js',
  ],
  out: 'docs',
  cleanOutputDir: true,
  sidebarLinks: {
    GitHub: 'https://github.com/cto-af/linebreak',
    Documentation: 'http://cto-af.github.io/linebreak/',
    Spec: 'https://www.unicode.org/reports/tr14/',
  },
  navigation: {
    includeCategories: false,
    includeGroups: false,
  },
  categorizeByGroup: false,
  sort: ['static-first', 'alphabetical'],
};
