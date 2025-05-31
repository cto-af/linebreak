import assert from "assert/strict";
import { fileURLToPath } from "url";
import path from "path";
import { writeFile } from "@cto.af/unicode-trie/file";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const lib = path.resolve(__dirname, "..", "lib");

const eaw = await writeFile("EastAsianWidth.txt", {
  dir: lib,
  cacheDir: __dirname,
  initialValue: "N",
  errorValue: "N",
  transform(x) {
    return ["F", "W", "H"].includes(x) ? "Y" : null;
  },
  verbose: true,
});

const lb = await writeFile("LineBreak.txt", {
  dir: lib,
  cacheDir: __dirname,
  initialValue: "XX",
  errorValue: "ER",
  verbose: true,
});

// Spot checks
const { LineBreak } = await import(lb);
const checks = {
  "0": "CM",
  "1F1EA": "RI",
  "1F532": "AL",
  "E0100": "CM",
};

for (const [hex, cls] of Object.entries(checks)) {
  assert.equal(LineBreak.getString(parseInt(hex, 16)), cls);
}

const { EastAsianWidth } = await import(eaw);
const eaw_checks = {
  "FF01": "Y",
};

for (const [hex, cls] of Object.entries(eaw_checks)) {
  assert.equal(EastAsianWidth.getString(parseInt(hex, 16)), cls);
}
