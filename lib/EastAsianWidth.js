import {UnicodeTrie} from "@cto.af/unicode-trie-runtime";

export const version = "16.0.0";
export const inputFileDate = new Date("2024-04-30T21:48:20.000Z");
export const etag = {
  "EastAsianWidth.txt": "\"30982-6208a0b8364c0-gzip\"",
};
export const lastModified = {
  "EastAsianWidth.txt": "Sun, 25 Aug 2024 23:05:31 GMT",
};
export const generatedDate = new Date("2025-05-31T19:50:17.960Z");
export const EastAsianWidth = UnicodeTrie.fromBase64(
  `AAAEAAAAAAD/////vgIAAB+LCAB5XTtoAgPtmj0sBEEUx/eOwlcUNBKRSFSiukSjEAqJ0NBR
   KhVCFKKRiEQiEomCQiGhoPFRCAqFQqHQKZHgGsl1SGjkCv/JzTI2N3b3br4u+zb5ZT52Zmf2
   zZs3b3b2OO155+ASXAM/naSQkPMoQPJIBi8Kn5UDr5J7n2U++wukqzyvBjSCZtAKOkAXyIAe
   0AcGAKszjHCUx00wztuaMNTmJNrx5+uMEA8yj3v3PL6I+AovuxSos470hpC3JcR3EGd1WXz/
   n7YIgiAIgiAIgiAIIsgB30eeGNyjR+VCQ59ozAmCIMzR5ODaQhCE2+efpaC7f1f8HOcG4W0R
   u+af64iwM5s7kHXADnbXFzirs0O/F5/dGpyJpQpkEW+v/Xt/COnVQN5JIP2OdAbt+8+xwawD
   7SfZtuQSfmb67HDf2Pk4+5/gLeG+4kdEHc2jXKoa/2KAOHJ+qiAfoAHvxnCtf82SPrVI8tsC
   +R1Is3HoRJgpUoe9ew8f1z6E/n8lg4iP8HzmU4wVGftxnjeBcBJMg7zQ5zmhzhTP89MLSC+H
   yHstwng8gE2U65Xoplh2G2X2eLlDhKcOjjd9Q/yF6dVROvUDXXQl+WIzwCZR+2hLLqrLqhgj
   mWxsWTOd76/62eXqow791jku5cpFxTyMI1fdOhNnnFXaorB6Yr+KlY0zz2X1deijbh0Pk0mY
   3FTbDJvyMm1PdOhMmG674q/oassV/6wS/EOX+mBLJirbU/0sE7pjug2bc71S9m82+m/i/ct9
   XthezYTcdNyPKu8o93W8t0mfxva8L0XmsrIu+P0y3VPxbcS0vXT1W5aOtkvxz2ytbzbsgctj
   anP/o7Nt1WuFLv+yksbC5X2Y6rXS5Npu80wjrn8dZb2OOgdV+2q693eqx822HbWx31S13zNp
   U0zbS1P7jW+ibxEewEsAAB+LCAB5XTtoAgOLVvJT0lGKVIoFANHfAiwJAAAA`
);

/**
 * @type {Record<string, number>}
 */
export const names = Object.fromEntries(
  EastAsianWidth.values.map((v, i) => [v, i])
);
export const {values} = EastAsianWidth;
