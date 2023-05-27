import { UnicodeTrieBuilder } from '@cto.af/unicode-trie/builder.js';
import assert from 'assert/strict';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import path from 'path';

// https://www.unicode.org/Public/UCD/latest/ucd/EastAsianWidth.txt

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NOW = new Date();

async function processFile(name, defaultValue) {
  const INPUT = path.join(__dirname, `${name}.txt`);
  const OUTPUT = path.resolve(__dirname, '..', 'lib', `${name}.js`);

  // Cache data in local file.  Requires Node v18+.
  let txt = null;
  try {
    txt = await fs.readFile(INPUT, 'utf8');
  } catch (e) {
    const res = await fetch(`https://www.unicode.org/Public/UCD/latest/ucd/${name}.txt`);
    txt = await res.text();
    fs.writeFile(INPUT, txt, 'utf8');
  }

  // # LineBreak-15.0.0.txt
  // # Date: 2022-07-28, 09:20:42 GMT [KW, LI]

  const ver = txt.match(/^#\s*\S+-(\d+\.\d+\.\d+).txt/)[1];
  const date = txt.match(/^#\s*Date: ([\d,: GMT-]+)/m)[1];

  const trie = new UnicodeTrieBuilder(defaultValue, 'ER');

  const matches
    = txt.matchAll(/^(\p{Hex}{4,6})(?:\.\.(\p{Hex}{4,6}))?;(\S+)/gmu);
  for (const match of matches) {
    // Cut down the size of the width trie, we only need F, W, and H.
    if ((name === 'EastAsianWidth') && (['F', 'W', 'H'].indexOf(match[3]) === -1)) {
      continue;
    }
    const start = parseInt(match[1], 16);
    if (match[2]) {
      const end = parseInt(match[2], 16);
      trie.setRange(start, end, match[3]);
    } else {
      trie.set(start, match[3]);
    }
  }

  const buf = trie.toBuffer();
  await fs.writeFile(OUTPUT, `\
import { UnicodeTrie } from '@cto.af/unicode-trie';

export const version = '${ver}';
export const inputFileDate = new Date('${new Date(date).toISOString()}');
export const generatedDate = new Date('${NOW.toISOString()}');
export const ${name} = new UnicodeTrie(Buffer.from(
  '${buf.toString('base64')}',
  'base64'
));
/**
 * @type {Record<string, number>}
 */
export const classes = Object.fromEntries(
  ${name}.values.map((v, i) => [v, i])
);
export const values = ${name}.values;
`);
  return OUTPUT;
}

const eaw = await processFile('EastAsianWidth', 'XX');
const lb = await processFile('LineBreak', 'XX');

// Spot checks
const { LineBreak } = await import(lb);
const checks = {
  '0': 'CM',
  '1F1EA': 'RI',
  '1F532': 'AL',
  'E0100': 'CM',
};

for (const [hex, cls] of Object.entries(checks)) {
  assert.equal(LineBreak.getString(parseInt(hex, 16)), cls);
}

const { EastAsianWidth } = await import(eaw);
const eaw_checks = {
  'FF01': 'F',
};

for (const [hex, cls] of Object.entries(eaw_checks)) {
  assert.equal(EastAsianWidth.getString(parseInt(hex, 16)), cls);
}
