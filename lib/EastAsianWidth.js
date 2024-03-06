import {Buffer} from "node:buffer";
import {UnicodeTrie} from "@cto.af/unicode-trie";

export const version = "15.1.0";
export const inputFileDate = new Date("2023-07-28T23:34:08.000Z");
export const generatedDate = new Date("2024-03-06T21:06:04.051Z");
export const EastAsianWidth = new UnicodeTrie(Buffer.from(
  `AAAEAAAAAABQAgAAG99JMB6Jsa2CPeYryr2sfj99GygBKkJSf6IyVUDkyleXutZFVhEqYAoA
   mJtrCtRv0ZrqSbitMeeLQiLoCh3hSuDeR5eMedj/slD10Y0R5iZ4+1ElV2MAzTz7ie96VxgM
   BoNCIFAIDAKBQiFQGMxQI8EMpKCeSXI0syhuvoVSwY4LVLCPs8kIN7NFeMQnCP+GjwxUoAMj
   WMEBrmOpccOHwuuBEDTEyKsphJvIPvu382JWAW5AzGWi59pyqq/JBkL7AAd6X0lutmWoXTK8
   jsjwhoAZJtQw4MSUXienlP8GngeVYoXLhKPpn04ds0TKLcS+/L9zzLE4iZ7Sb4+w85UVDsyg
   8c3APOBwzY6Po64NSwzM3jzeUfk3MNAepfJMo6KX2/yfptV2McXQ0c6pKaP7H0DHF9wCL2LA
   VpoRrvPjw+JMsFaoUXSrAnX1xaZnLg2yNZtBrnpYAUeAA4EeR5pISE8+6yfznmtTJd4rBUSh
   Ldz0MwSs1VWmteyH40rrGprQhSGL0EL41q07Vp3scFtX1QxMl6kCS6s6iRLFngIY4zQBuAm3
   iesqIJrwHuAuIdQEG3mAAXfFAnIa/rPEfFOMA1xncd81oA89/JMZ3XP+FLBSKg3FUOLPLpUA
   u53UYL1UHlPJOKMn20b8A2OVN5LoVDAfwnL8t/KhRIdlBmjyhnoCxO2HJTDqLN2BuIRqOWjz
   3FoN8fSiXC6+0EnqSiK028ZajciD2V3UhLc0/o1FsII8qw3w1DgGjoNkBjrNMoxlu/GnvnVL
   yNjUsU0v3smU+gsEgFsiTiIsIlkiXQM=`,
  "base64"
));

/**
 * @type {Record<string, number>}
 */
export const names = Object.fromEntries(
  EastAsianWidth.values.map((v, i) => [v, i])
);
export const {values} = EastAsianWidth;
