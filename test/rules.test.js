import { PASS, Rules } from "../lib/index.js";
import { LineBreak } from "../lib/LineBreak.js";
import assert from "assert/strict";

function assertBreaks(str, expected, opts) {
  const r = new Rules(opts);
  const actual = [...r.breaks(str)].map(b => b.position);
  assert.deepEqual(
    actual,
    expected,
    JSON.stringify(str) + " "
      + [...str].map(c => {
        const cp = c.codePointAt(0);
        return cp.toString(16).padStart(4, 0) + ":" + LineBreak.values[LineBreak.get(cp)];
      }).join(" ")
  );
}

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

describe("rule list manipulation", () => {
  const rc = new Rules();
  const numRules = rc.rules.length;

  it("removes", () => {
    const r = new Rules();
    const rem = r.removeRule("LB25");
    assert.equal(r.rules.length, numRules - 1);
    assert.equal(rem.length, 1);
    assert.equal(r.rules.findIndex(r => r.name === "LB25"), -1);
    assert.deepEqual(r.removeRule(), []);
    assert.deepEqual(r.removeRule("BAD_RULE_NAME"), []);
  });

  function newRule() {
    return PASS;
  }

  it("adds after", () => {
    const r = new Rules();
    const lb2 = r.rules.findIndex(r => r.name === "LB02");
    r.addRuleAfter("LB02");
    assert.equal(r.rules.length, numRules);
    assert.throws(() => r.addRuleAfter("BAD_RULE_NAME"));
    const i = r.addRuleAfter("LB02", newRule);
    assert.equal(r.rules.length, numRules + 1);
    assert.equal(i, lb2 + 1);
    assert.equal(r.rules[i], newRule);
  });

  it("adds before", () => {
    const r = new Rules();
    const lb2 = r.rules.findIndex(r => r.name === "LB02");
    r.addRuleBefore("LB02");
    assert.equal(r.rules.length, numRules);
    assert.equal(r.rules.length, numRules);
    assert.throws(() => r.addRuleBefore("BAD_RULE_NAME"));
    const i = r.addRuleBefore("LB02", newRule);
    assert.equal(r.rules.length, numRules + 1);
    assert.equal(i, lb2);
    assert.equal(r.rules[i], newRule);
  });

  it("replaces", () => {
    const r = new Rules();
    const lb2 = r.rules.findIndex(r => r.name === "LB02");
    const lr = r.replaceRule("LB02");
    // Put it back
    r.rules.splice(lb2, 0, ...lr);
    assert.equal(r.rules.findIndex(r => r.name === "LB02"), lb2);
    assert.throws(() => r.replaceRule("BAD_RULE_NAME"));
    r.replaceRule("LB02", newRule);
    assert.equal(r.rules.length, numRules);
    assert.equal(r.rules[lb2], newRule);
  });

  it("does verbose logging", () => {
    const old = console.log;
    const res = [];
    console.log = (...args) => res.push(args);
    assertBreaks("a b", [2, 3], { verbose: true });
    console.log = old;
  });

  it("handles bad rule lists", () => {
    const r = new Rules();
    r.rules = [];
    assert.deepEqual([...r.breaks("a b")], []);
  });

  it("uses extra properties", () => {
    const r = new Rules();
    r.rules.unshift(state => {
      state.setProp("foo", true);
      return PASS;
    });
    assert.deepEqual([...r.breaks("a")].map(b => b.props), [{ foo: true }]);
  });
});

describe("conformance tests use example 7", () => {
  const opts = {
    string: true,
    example7: true,
  };

  it("has a new LB13", () => {
    assertBreaks("9}", [2], opts); // NU CL
    assertBreaks("a}", [2], opts); // AL CL
    assertBreaks("9)", [2], opts); // NU CP
    assertBreaks("a)", [2], opts); // AL CP
    assertBreaks("9!", [2], opts); // NU EX
    assertBreaks("a!", [2], opts); // AL EX
    assertBreaks("9,", [2], opts); // NU IS
    assertBreaks("a,", [2], opts); // AL IS
    assertBreaks("9/", [2], opts); // NU SY
    assertBreaks("a/", [2], opts); // AL SY
  });

  it("has a new LB25", () => {
    assertBreaks("$9", [2], opts);
    assertBreaks("%9", [2], opts);
    assertBreaks("$(9", [3], opts);
    assertBreaks("$-9", [3], opts);
    assertBreaks("$-a", [2, 3], opts);
    assertBreaks("$\x01", [2], opts);
    assertBreaks("9999999\xb4", [7, 8], opts);
    assertBreaks("9)\xb4", [2, 3], opts);
    assertBreaks("9%\xb4", [2, 3], opts);
    assertBreaks("9\xb4", [1, 2], opts);
    assertBreaks("9)%\xb4", [3, 4], opts);
    assertBreaks("(9\xb4", [2, 3], opts);
    assertBreaks("aa", [2], opts);
  });
});
