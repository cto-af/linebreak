#!/usr/bin/env node

/**
 * @fileoverview
 * This program reads a test off of stdin (or the first argument)
 * and runs the linebreak algorithm in verbose mode, for debugging.
 *
 * @example
 * ./tools/verbose.js "× 1F1FF × 200D × 1F1FF × 200D × 1F1FF × 1F1FF ×"
 */
import { Rules } from "../lib/index.js";

const breaker = new Rules({
  string: true,
  verbose: true,
});

let stdin = process.argv[2];
if (!stdin) {
  for await (const chunk of process.stdin) {
    stdin += chunk;
  }
}

const codePoints = stdin.split(/\s*[×÷]\s*/).slice(1, -1).map(c => parseInt(c, 16));
const str = String.fromCodePoint(...codePoints);
const breaks = [...breaker.breaks(str)];

console.log();
let count = 0;
for (const b of breaks) {
  console.log(++count, b);
  console.log();
}
console.log(`${count} total break(s)`);
