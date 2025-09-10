import {UnicodeTrie} from "@cto.af/unicode-trie-runtime";

export const version = "17.0.0";
export const inputFileDate = new Date("2025-07-24T00:12:54.000Z");
export const etag = {
  "EastAsianWidth.txt": "\"3137b-63c70d19d13c0-gzip\"",
};
export const lastModified = {
  "EastAsianWidth.txt": "Sat, 16 Aug 2025 00:45:11 GMT",
};
export const generatedDate = new Date("2025-09-10T18:38:45.590Z");
export const EastAsianWidth = UnicodeTrie.fromBase64(
  `AAAEAAAAAAD/////wQIAAB+LCAC1xcFoAgPtmj1IHUEQxzd5FiaEkMLSKqQIViEQCEmTjyqk
   SUgR7OySTrHxdVoIYqUg2AgqFhYWFhYidpYqKDaClVZaqJWF2qj/xT1cjjtv772Z3T1uHvzY
   753d2b252ds3+1SpRbAMVkGSrlMo5LNjIfqoB/uEfR2Ao5yy4zb7PgUX4Brcgo6GUi9AF+gG
   r0EPeAc+AN3mM8KvJu6DH0bWb08yeyEneV77rHia/yjbMvEBxJum7mCqzQjSo1beuBWfRFy3
   1fHpR2QJgiAIgiAIgiAIQpoZc45c8HhGd2WJYUyy5oIgCP5oRPhuEQQh7vvPVuAe34q5x1lH
   uJFh15J7HRt9Z7MJ9iKwg1fP72kG4osqz3ynUlNPHjhC2i5/9UypX8DOa6bSa0hfAbsf33zE
   /EPLr7NtOYj4zlTfD+v7dG0r8uzhXM39qEPH9TtBvTNwUXK9dyv0frzE3DSxje8mZ0yNjuz8
   zlT+S6T1OnQh7M5oo+f+Bvk67EGY/OfiPeKfTL5+hr6ZuM13k/cT4R/QC86tMfdZbf4a2Un6
   H9L9OXNIGCoo12yDYdR7mzG+tP8yhjoTpt607tuh/6r7b1VG7yv5ya/OP7iZQXEdYyi9UNel
   WKM83YTQE/f8qftudz9y7G/OdWlXLxTPYRm9cu+ZMutMaYuK2tnjyqpb5jnPa8+xH7n3eJFO
   ivRGbTNC6su3PeHYM0V7OxZ/hUtWLP5ZFfzDmMYQSieU8qj78rF3fMsI+axX5fwWYvw+5t9u
   f0VnNR964yh31bdLOce8qfYb11ndVWeUvibHfCj8tZD2LNZvTRyyW/GfQr1/OM8gob/LcPn8
   If3iVmVT23Iu/69KaxHzOYn6XenTNw1551DW/3V5X7v6c9Tfh7jPX9TrFtqOhjgPttqeW28u
   33192kvqs2vW7w7BeyuJcEoAAB+LCAC1xcFoAgOLVvJT0lGKVIoFANHfAiwJAAAA`
);

/**
 * @type {Record<string, number>}
 */
export const names = Object.fromEntries(
  EastAsianWidth.values.map((v, i) => [v, i])
);
export const {values} = EastAsianWidth;
