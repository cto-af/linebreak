import { BreakerState } from '../lib/state.js';
import assert from 'assert/strict';

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
});
