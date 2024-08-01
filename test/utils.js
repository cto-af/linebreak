import { LineBreak } from "../lib/LineBreak.js";
import { Rules } from "../lib/index.js";
import assert from "node:assert/strict";

export function assertBreaks(str, expected, opts) {
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
