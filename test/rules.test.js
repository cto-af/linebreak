import { Rules } from "../lib/index.js";
import assert from "node:assert/strict";
import { assertBreaks } from "./utils.js";

describe("Run rules in order", () => {
  it("produces one break for an empty string", () => {
    assertBreaks("", [0]);
  });

  it("checks rules", () => {
    // LB4
    assertBreaks("a\u2028b", [2, 3]);
    // LB5
    assertBreaks("\n", [1]);
    assertBreaks("a\nb", [2, 3]);
    assertBreaks("\r\n", [2]);
    assertBreaks("a\r\nb", [3, 4]);
    assertBreaks("a\rb", [2, 3]);
    // LB6
    assertBreaks("#\v", [2]);
    // LB7
    assertBreaks("a  b", [3, 4]);
    // LB8
    assertBreaks("a\u200Bb", [2, 3]);
    assertBreaks("a\u200B bc", [3, 5]);
    assertBreaks("a\u200B   bc", [5, 7]);
    // LB8a
    assertBreaks("\u200Db", [2]);
    // LB9
    assertBreaks("a\u0308b", [3]);
    assertBreaks(" \u0308b", [1, 3]);
    assertBreaks("\v\u0308b", [1, 3]);
    // LB10
    assertBreaks("\u0308b", [2]);
    // LB11
    assertBreaks("a\u2060", [2]);
    assertBreaks("\u2060a", [2]);
    // LB12
    assertBreaks("\xa0b", [2]);
    // LB12a
    assertBreaks(" \xa0", [1, 2]);
    assertBreaks("-\xa0", [1, 2]);
    assertBreaks("a\xa0", [2]);
    // LB13
    assertBreaks("a!", [2]);
    assertBreaks("a !", [3]);
    assertBreaks("a\u2046", [2]);
    // LB14
    assertBreaks("\u2329a", [2]);
    assertBreaks("\u2329  a", [4]);
    // LB16
    assertBreaks("\u2046\u2047", [2]);
    assertBreaks("\u2046 \u2047", [3]);
    assertBreaks("\u2046  \u2047", [4]);
    assertBreaks("\u2046 ", [2]);
    // LB17
    assertBreaks("\u2014\u2014", [2]);
    assertBreaks("\u2014 \u2014", [3]);
    assertBreaks("\u2014 ", [2]);
    // LB18
    assertBreaks("a   b", [4, 5]);
    // LB19
    assertBreaks('a"', [2]);
    assertBreaks('"b', [2]);
    // LB20
    assertBreaks("a\uFFFC", [1, 2]);
    assertBreaks("\uFFFCb", [1, 2]);
    // LB21
    assertBreaks("a-", [2]);
    assertBreaks("a\u17D6", [2]);
    assertBreaks("a\t", [2]);
    assertBreaks("\xb4b", [2]);
    // LB21a
    assertBreaks("\uFB1D-a", [3]);
    assertBreaks("\uFB1D\ta", [3]);
    // LB21b
    assertBreaks("/\u05D0", [2]);
    // LB22
    assertBreaks("a\u2025", [2]);
    // LB23
    assertBreaks("ab", [2]);
    assertBreaks("a9", [2]);
    assertBreaks("9b", [2]);
    assertBreaks("9\u05D0", [2]);
    assertBreaks("9\x01", [2]);
    // LB23a
    assertBreaks("$\u231A", [2]);
    assertBreaks("$\u261D", [2]);
    assertBreaks("$\u{1F3FB}", [3]);
    assertBreaks("\u231A%", [2]);
    assertBreaks("\u261D%", [2]);
    assertBreaks("\u{1F3FB}%", [3]);
    // LB24
    assertBreaks("$a", [2]);
    assertBreaks("%a", [2]);
    assertBreaks("$\u05D0", [2]);
    assertBreaks("%\u05D0", [2]);
    assertBreaks("a$", [2]);
    assertBreaks("a%", [2]);
    assertBreaks("\u05D0$", [2]);
    assertBreaks("\u05D0%", [2]);
    // LB25
    assertBreaks("}%", [2]);
    assertBreaks("%9", [2]);
    assertBreaks("-9", [2]);
    assertBreaks("%%", [1, 2]);
    assertBreaks("9%", [2]);
    assertBreaks("9$", [2]);
    assertBreaks("99", [2]);
    assertBreaks("9\u2014", [1, 2]);
    // LB26
    assertBreaks("\u1100\u1100", [2]);
    assertBreaks("\u1100a", [1, 2]);
    assertBreaks("\u1160\u1160", [2]);
    assertBreaks("\u1160a", [1, 2]);
    assertBreaks("\u11A8\u11A8", [2]);
    assertBreaks("\u11A8a", [1, 2]);
    // LB27
    assertBreaks("\u1100%", [2]);
    assertBreaks("$\u1100", [2]);
    assertBreaks("$\x01", [2]);
    // LB28
    assertBreaks("ab", [2]);
    assertBreaks("a\u05D0", [2]);
    assertBreaks("\u05D0b", [2]);
    assertBreaks("\u05D0\u05D0", [2]);
    // LB29
    assertBreaks(".b", [2]);
    assertBreaks(".\u05D0", [2]);
    // LB30
    assertBreaks("a(", [2]);
    assertBreaks("a\u2329", [1, 2]);
    assertBreaks(")a", [2]);
    assertBreaks(")\xa7", [2]);
    // LB30a
    assertBreaks("\u{1F1FA}", [2]);
    assertBreaks("\u{1F1FA}a", [2, 3]);
    assertBreaks("\u{1F1FA}\u{1F1F8}a", [4, 5]);
    // LB30b
    assertBreaks("\u261D\u{1F3FB}", [3]);
    assertBreaks("\u{1F02C}\u{1F3FF}", [4]);
  });

  it("produces strings if wanted", () => {
    const r = new Rules({ string: true });
    assert.deepEqual([...r.breaks("a\nb")].map(b => b.string), ["a\n", "b"]);
  });

  it("handles invalid state", () => {
    const r = new Rules();
    r.rules = [() => 0];
    assert.throws(() => [...r.breaks(" ")]);
  });
});
