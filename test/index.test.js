import { after, test } from "node:test";
import { Rules } from "../lib/index.js";
import assert from "assert";
import fs from "fs/promises";

// We have to include the tailoring from Example 7:
//
// "For those who do implement the default breaks as specified in this annex,
// plus the tailoring of numbers described in Example 7 of Section 8.2,
// Examples of Customization, and wish to check that that their implementation
// matches that specification, a test file has been made available in
// [Tests14]."

let count = 0;
let total = 0;

test("unicode line break tests", async t => {
  after(() => {
    console.error({ count, total, fail: total - count });
  });

  const data = await fs.readFile(new URL("LineBreakTest.txt", import.meta.url), "utf8");
  const lines = data.split("\n");

  for (let rowNumber = 1; rowNumber <= lines.length; rowNumber++) {
    const line = lines[rowNumber - 1];
    if (!line || /^#/.test(line)) { continue; }

    const [cols, comment] = line.split("#");
    const codePoints = cols.split(/\s*[×÷]\s*/).slice(1, -1).map(c => parseInt(c, 16));
    const str = String.fromCodePoint(...codePoints);

    const breaker = new Rules({
      string: true,
    });

    const breaks = [...breaker.breaks(str)].map(s => s.string);

    const expected = cols.split(/\s*÷\s*/).slice(0, -1).map(c => {
      let codes = c.split(/\s*×\s*/);
      if (codes[0] === "") { codes.shift(); }
      codes = codes.map(c => parseInt(c, 16));
      return String.fromCodePoint(...codes);
    });

    // eslint-disable-next-line no-loop-func
    await t.test(cols, () => {
      total++;
      assert.deepStrictEqual(
        breaks,
        expected,
        `${rowNumber} ${JSON.stringify(breaks)} != ${JSON.stringify(expected)} # ${comment}`
      );
      count++;
    });
  }
});

test("generates strings", () => {
  const breaker = new Rules({
    string: true,
  });
  const res = [...breaker.breaks("foo bar")].map(b => b.string);
  assert.deepStrictEqual(
    res,
    ["foo ", "bar"]
  );
});

test("extra inputs", () => {
  const breaker = new Rules({
    string: true,
    //
    // verbose: true,
  });
  for (const [input, expected] of [
    ["subtract .5", ["subtract ", ".5"]], // LB15c
    ["subtract .", ["subtract ."]], // !LB15c
    ["5////5", ["5////5"]],
    ["$(,9", ["$(,9"]], // LB25, PR OP IS NU
  ]) {
    const breaks = [...breaker.breaks(input)].map(s => s.string);
    assert.deepEqual(breaks, expected);
  }
});

test.only("Deprecate ex7", () => {
  assert.throws(() => new Rules({
    example7: true,
  }));
});
