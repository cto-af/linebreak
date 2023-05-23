import { UnicodeTrieBuilder } from '@cto.af/unicode-trie/builder.js';
import assert from 'assert/strict';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const INPUT = path.join(__dirname, 'LineBreak.txt');
const OUTPUT = path.resolve(__dirname, '..', 'lib', 'lineBreak.js');

// Cache linebreak data in local file.  Requires Node v18+.
let txt = null;
try {
  txt = await fs.readFile(INPUT, 'utf8');
} catch (e) {
  const res = await fetch('https://www.unicode.org/Public/UCD/latest/ucd/LineBreak.txt');
  txt = await res.text();
  fs.writeFile(INPUT, txt, 'utf8');
}

// These need to be pre-allocated so that the pairs table works.
// The rest of the values don't matter.
const values = [
  'OP',
  'CL',
  'CP',
  'QU',
  'GL',
  'NS',
  'EX',
  'SY',
  'IS',
  'PR',
  'PO',
  'NU',
  'AL',
  'HL',
  'ID',
  'IN',
  'HY',
  'BA',
  'BB',
  'B2',
  'ZW',
  'CM',
  'WJ',
  'H2',
  'H3',
  'JL',
  'JV',
  'JT',
  'RI',
  'EB',
  'EM',
  'ZWJ',
  'CB',
];

const trie = new UnicodeTrieBuilder('XX', 'ER', values);

const matches
  = txt.matchAll(/^(\p{Hex}{4,6})(?:\.\.(\p{Hex}{4,6}))?;(\S+)/gmu);
for (const match of matches) {
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

export const LineBreak = new UnicodeTrie(Buffer.from(
  '${buf.toString('base64')}',
  'base64'
));
/**
 * @type {Record<string, number>}
 */
export const Classes = Object.fromEntries(
  LineBreak.values.map((v, i) => [v, i])
);
export const Values = LineBreak.values;
`);

// Spot checks
const { LineBreak } = await import(OUTPUT);
const checks = {
  '0': 'CM',
  '1F1EA': 'RI',
  '1F532': 'AL',
  'E0100': 'CM',
};

for (const [hex, cls] of Object.entries(checks)) {
  assert.equal(LineBreak.getString(parseInt(hex, 16)), cls);
}
