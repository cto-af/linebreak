import { PASS, Rules } from "../lib/index.js";
import assert from "node:assert/strict";
import { assertBreaks } from "./utils.js";

const rc = new Rules();
const numRules = rc.rules.length;

describe("rule list manipulation", () => {
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
