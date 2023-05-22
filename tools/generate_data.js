import { UnicodeTrieBuilder } from '@cto.af/unicode-trie/builder.js';
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

const trie = new UnicodeTrieBuilder('XX', 'ER');
// Set defaults
trie.setRange(0x20000, 0x2FFFD, 'ID');
trie.setRange(0x30000, 0x3FFFD, 'ID');
trie.setRange(0x1F000, 0x1FAFF, 'ID');
trie.setRange(0x1FC00, 0x1FFFD, 'ID');
trie.setRange(0x20A0, 0x20CF, 'PR');

const matches = txt.matchAll(/^([0-9A-F]{4})(?:\.\.([0-9A-F]{4}))?;(\S+)/gm);
for (const match of matches) {
  if (match[2]) {
    trie.setRange(parseInt(match[1], 16), parseInt(match[2], 16), match[3]);
  } else {
    trie.set(parseInt(match[1], 16), match[3]);
  }
}

const buf = trie.toBuffer();
await fs.writeFile(OUTPUT, `\
import { UnicodeTrie } from '@cto.af/unicode-trie';

export const LineBreak = new UnicodeTrie(Buffer.from(
  '${buf.toString('base64')}',
  'base64'
));
export const Classes = Object.fromEntries(
  LineBreak.values.map((v, i) => [v, i])
);
`);

