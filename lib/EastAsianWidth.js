import {UnicodeTrie} from "@cto.af/unicode-trie";

export const version = "15.1.0";
export const inputFileDate = new Date("2023-07-28T23:34:08.000Z");
export const generatedDate = new Date("2024-08-01T03:33:09.558Z");
export const EastAsianWidth = UnicodeTrie.fromBase64(
  `AAAEAAAAAAD/////tQIAAB+LCAD1AatmAgPtmj9IHzEUx8+fbam1FLoUCh1aaCl0cSoODgou
   iougOAgu4iRO4iQiiDgoCoK4OYi66aabo5M4KKiToC7ioIPoIgjiN5qTeNz9LucvL8l57wcf
   ksu/l7x7SV4uv+VSEKyCdbAJwucihUwy+wqsj2JwZLCtY3CWkHdRYdtX4FbG70F1dRB8AF/A
   N/AD/Ab/QB0Q5f4jbJBxGzRLWW2WZHZATjhfu5V4lF7k7cp4P+KDsuxApM4wnkeVtHElPoW4
   qCvis2VkMQxjlrj9mWEYhmEYhmHyxrw8Ry5YPKPrskLQJ37nDMMw9ih5uLcwDOP3/Wcl32mp
   WJP3OBsIN2PWtfBeR0Xc2WyBHQ/Wwc+1T0x/ckNTkJ3Fj0EwV/XEKeI/a17mt+J5MpIWZRv5
   NZAftuOCVg/kF3ptKfid6aHHfRP344//hSi4r3iiaaPnKHcJbjLa9EEOdHCXYAPBu/j095H0
   WjyLcX5F+D2mjtDDL6SL8C/C8H8bdYjXy3SxZzfKuEqTTGtB2A66wLXS5x6lTqeUHT734Xkg
   YQwhtxr2vweG0M6fmP5FfaARlBkDE2AGzKfIfws+YJ4RdrVUqnqGf/wr8k/MAJfo9tGVXkyX
   NfGOknTjajWjHH/Wtinsj1JvVPVMjq9cW7pyytWn0IHar7iyWeZNUn0K+6G2yTSdpOnN9Hrm
   Ul+25z+FzaTZti/7P5UsX/ydPPhbPvXBlU5MyjPRlm3btS3D5VzPy3nIRf9tjL/S9tLOPjb0
   RpGvq2+dfIpx2/RpXM/71+g8qawPfn+S7Zn41kCxXvjwrYdC9mv8LVf7lYv57fM7dXmeoZRt
   eu2n8hfz9C58PleZ3vts7tUuv/ln9Zd19l/dOWja93J5XnPh31Ptf76t8VTrsmn/3PSa8QCh
   pJTR4EkAAB+LCAD1AatmAgOLVvJT0lGKVIoFANHfAiwJAAAA`
);

/**
 * @type {Record<string, number>}
 */
export const names = Object.fromEntries(
  EastAsianWidth.values.map((v, i) => [v, i])
);
export const {values} = EastAsianWidth;
