import { BreakerState, eot, resolve } from "../lib/state.js";
import { describe, it } from "node:test";
import assert from "assert/strict";
import { names } from "../lib/LineBreak.js";
import util from "util";

const {
  CM, SA,
} = names;

describe("manage parsing state", () => {
  it("pushes the next character", () => {
    const str = "123";
    const state = new BreakerState(str);
    assert.equal(state.cur.len, 0);
    assert.deepEqual([...state.codePoints(0)].map(c => c.len), [1, 2, 3]);
  });

  it("iterates from the middle", () => {
    const str = "123";
    const state = new BreakerState(str);
    assert.deepEqual([...state.codePoints(1)].map(s => s.len), [2, 3]);
    // Initialized with sot, sot, sot
    const first = state.afterNext();
    assert.deepEqual(first.char, "1");
    state.push(first);
    assert.deepEqual(state.afterNext().char, "2");
  });

  it("itereates backwards", () => {
    const str = "12\u{1F4AA}34";
    const state = new BreakerState(str);
    for (const cp of state.codePoints(0)) {
      state.push(cp);
    }
    state.pushEnd();
    const p = [...state.codePoints(state.cur.len, false)].map(cp => cp.char);
    assert.deepEqual(p, ["4", "3", "💪", "2", "1"]);
  });

  it("resolves Mn and Mc", () => {
    assert.equal(resolve(SA, "\u0E34"), CM); // Mn
    assert.equal(resolve(SA, "\u102B"), CM); // Mc
  });

  it("has debug text", () => {
    const state = new BreakerState("123");
    state.next.cls = eot;
    state.cur.cls = null;
    assert.equal(util.inspect(state), 'sot(-Infinity:"") => null(-Infinity:"") => eot(-Infinity:"")');
    state.cur.cls = 0;
    state.LB8 = true;
    state.spaces = true;
    state.RI = 1;
    state.setProp("foo", "bar");
    state.next.ignored = true;
    assert.equal(util.inspect(state), 'sot(-Infinity:"") => XX(-Infinity:"") => eot(-Infinity:"")Ig LB8 spaces RI: 1 {"foo":"bar"}');
  });
});
