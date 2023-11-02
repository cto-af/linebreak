/* eslint-disable max-len */
import { Rules } from '../lib/index.js';
import assert from 'assert';
import fs from 'fs';

// We have to include the tailoring from Example 7:
//
// "For those who do implement the default breaks as specified in this annex,
// plus the tailoring of numbers described in Example 7 of Section 8.2,
// Examples of Customization, and wish to check that that their implementation
// matches that specification, a test file has been made available in
// [Tests14]."

describe('unicode line break tests', function() {
  const data = fs.readFileSync(new URL('LineBreakTest.txt', import.meta.url), 'utf8');
  const lines = data.split('\n');

  return lines.forEach((line, i) => {
    const rowNumber = i + 1;
    if (!line || /^#/.test(line)) { return; }

    const [cols, comment] = line.split('#');
    const codePoints = cols.split(/\s*[×÷]\s*/).slice(1, -1).map(c => parseInt(c, 16));
    const str = String.fromCodePoint(...codePoints);

    const breaker = new Rules({
      string: true,
      example7: true,
    });

    const breaks = [...breaker.breaks(str)].map(s => s.string);

    const expected = cols.split(/\s*÷\s*/).slice(0, -1).map(c => {
      let codes = c.split(/\s*×\s*/);
      if (codes[0] === '') { codes.shift(); }
      codes = codes.map(c => parseInt(c, 16));
      return String.fromCodePoint(...codes);
    });

    it(cols, () => {
      assert.deepStrictEqual(
        breaks,
        expected,
        `${rowNumber} ${JSON.stringify(breaks)} != ${JSON.stringify(expected)} # ${comment}`
      );
    });
  });
});

describe('options', () => {
  it('generates strings', () => {
    const breaker = new Rules({
      string: true,
    });
    const res = [...breaker.breaks('foo bar')].map(b => b.string);
    assert.deepStrictEqual(
      res,
      ['foo ', 'bar']
    );
  });
});
