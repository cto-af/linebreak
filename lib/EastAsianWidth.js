import {UnicodeTrie} from "@cto.af/unicode-trie-runtime";

export const version = "18.0.0";
export const inputFileDate = new Date("2026-06-29T15:25:05.000Z");
export const etag = {
  "EastAsianWidth.txt": "\"31fa1-65a71c4edff80-gzip\"",
};
export const lastModified = {
  "EastAsianWidth.txt": "Tue, 01 Sep 2026 20:29:02 GMT",
};
export const generatedDate = new Date("2026-10-22T15:51:46.124Z");
export const EastAsianWidth = UnicodeTrie.fromBase64(
  `AAAEAAAAAAD/////3gIAAB+LCAASMdpqAgPtmj1IHEEUxzdqoTEQQtLYBEIIqUKKkCZphEBC
   CATSBNIEErERbAQ/GrFSEMVGtBFEVLQQtBC0ELSzEVRQbASx0UYUsRBBEP+Ds9xw3Lqz3nsz
   c+w7+DFvdr7fvPm+qaoomgOLYAXE/jy5QjI7BqKPfLBPmNcBOEoIOykz73NwBW5ATXUU1YFn
   oAG8Am/Be/ARfAIqTSPcr1p2wU9d1m9HZf5FOfF4bTbkYloRtqXldsjdOm5nUZpe+PuNb0OG
   PAJZpVXy2D1lCYIgCIIgCIIgCEIxE/ocOevwjG7LAkOdpM8FQRDcURvg2iIIQtjvnw+Bu37L
   +h1nDe56iXktftcxUW82m2AvgHnwSf0dg4/90BhlZ6I2ioYfFTiE/0VdIfw15CbDrxgo8m/A
   X4/yzXxc8yOA8vM8txwE/GZ6rN/TlXxmzBNmnGmC+l/qPFReebaFa0tdVtdg/wqegix63q2g
   tfY52qYIrX6nCTbakFDXl/j+xgh7B1n1wwe4n0ukUW3/ovv1O9z4/xu/IP/R39Xa/a9E3//X
   31rgtoEucGHUucdI06HLjv198A/do+9RhI1b9Mc2mEG8bwm2acadN+IsQV4NsL/lrq6AsqvJ
   Kiza8pNfjn9qBPjEto6+9EIdl6KPknTjazbjbD913uXaI4d9c/ZLuXqhGIdZ9MptM1n6mXIu
   Sktn1qtU3CzjPCk9hz1y23iaTtL0Rj1n+NSX6/mEw2bSbDuU/QpXWaHszyphfxhSHXzphLI8
   6rxc2I7rMnyO9Uo5v/mov4v2l5tf2lnNhd44wm31bRPO0W4qewttvIVyF8LRfs67EVsbtW2P
   y7150ljkGh8hrxPUdkK15vi2B9fjlfOM6PvejOtM5vPc8tCyqddarv15JfVFyOdY6rXV9bof
   0t7Htp62dmHz9kNxfxfqGwbV3Qu13fiex33s37Oe/7jOC67vdmx+t8spipFwTAAAH4sIABIx
   2moCA4tW8lPSUYpUigUA0d8CLAkAAAA=`
);

/**
 * @type {Record<string, number>}
 */
export const names = Object.fromEntries(
  EastAsianWidth.values.map((v, i) => [v, i])
);
export const {values} = EastAsianWidth;
