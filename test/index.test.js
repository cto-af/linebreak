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
  // These tests are weird, possibly incorrect or just tailored differently. we skip them.
  const skip = [

  ];

  const verbose = [
  ];

  const filterRules = {
    // 7486: ['LB25'], // 005C ÷ 0028 matches PR × OP, LB25
    // 7491: ['LB25'], // 005C ÷ 007B matches PR × OP, LB25
    // 7576: ['LB25'], // 002E ÷ 0032 matches IS × NU, LB25
    // 7577: ['LB25'], // 002E ÷ 0032 matches IS × NU, LB25
    // 7578: ['LB25'], // 002E ÷ 0032 matches IS × NU, LB25
    // 7579: ['LB25'], // 002E ÷ 0032 matches IS × NU, LB25
    // 7580: ['LB25'], // 002E ÷ 0032 matches IS × NU, LB25
    // 7581: ['LB25'], // 002E ÷ 0032 matches IS × NU, LB25
    // 7583: ['LB25'], // 002E ÷ 0031 matches IS × NU, LB25
    // 7584: ['LB25'], // 002E ÷ 0032 matches IS × NU, LB25
    // 7585: ['LB25'], // 002E ÷ 0033 matches IS × NU, LB25
    // 7586: ['LB25'], // 002E ÷ 0034 matches IS × NU, LB25
    // 7587: ['LB25'], // 002e ÷ 0032 matches IS × NU, LB25
  };

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
      verbose: verbose.includes(rowNumber),
    });
    const filters = filterRules[rowNumber];
    if (filters) {
      breaker.removeRule(...filters);
    }

    const breaks = [...breaker.breaks(str)].map(s => s.string);

    const expected = cols.split(/\s*÷\s*/).slice(0, -1).map(c => {
      let codes = c.split(/\s*×\s*/);
      if (codes[0] === '') { codes.shift(); }
      codes = codes.map(c => parseInt(c, 16));
      return String.fromCodePoint(...codes);
    });

    if (skip.includes(rowNumber)) {
      it(cols, function() {
        // If we happen to fix something, let us know.
        assert.notDeepStrictEqual(
          breaks,
          expected,
          `${rowNumber} ${JSON.stringify(breaks)} != ${JSON.stringify(expected)} # ${comment}`
        );
        this.skip();
      });
      return;
    }

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
