import { BreakerState, eot, resolve } from '../lib/state.js';
import assert from 'assert/strict';
import { classes } from '../lib/LineBreak.js';
import util from 'util';

const {
  CM, SA,
} = classes;

describe('manage parsing state', () => {
  it('pushes the next character', () => {
    const str = '123';
    const state = new BreakerState(str);
    assert.equal(state.cur.len, 0);
    assert.deepEqual([...state.codePoints(0)].map(c => c.len), [1, 2, 3]);
  });
  it('iterates from the middle', () => {
    const str = '123';
    const state = new BreakerState(str);
    assert.deepEqual([...state.codePoints(1)].map(s => s.len), [2, 3]);
  });

  it('resolves Mn and Mc', () => {
    assert.equal(resolve(SA, '\u0E34'), CM); // Mn
    assert.equal(resolve(SA, '\u102B'), CM); // Mc
  });

  it('has debug text', () => {
    const state = new BreakerState('123');
    state.next.cls = eot;
    state.cur.cls = null;
    assert.equal(util.inspect(state), 'sot(-Infinity:"") => null(-Infinity:"") => eot(-Infinity:"")');
    state.cur.cls = 0;
    state.LB8 = true;
    state.spaces = true;
    state.RI = 1;
    state.ex7pos = 5;
    state.setProp('foo', 'bar');
    assert.equal(util.inspect(state), 'sot(-Infinity:"") => XX(-Infinity:"") => eot(-Infinity:"") LB8 spaces RI: 1 ex7: 5 {"foo":"bar"}');
  });
});
