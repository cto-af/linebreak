import { UnicodeTrie } from '@cto.af/unicode-trie';

export const version = '15.0.0';
export const inputFileDate = new Date('2022-05-24T17:40:20.000Z');
export const generatedDate = new Date('2023-05-27T21:07:35.864Z');
export const EastAsianWidth = new UnicodeTrie(Buffer.from(
  'AAAEAAEAAABuAgAAGw9LMJ4JdgxlRBx2bH35wTj8txvIBDihbY1qcIJ1g9rWFkWl/x0AMLa1CtwXQABUNKZ6CmwMOhaWUNqquProkkaHnxLJegKjawWRNb/h+6iSq7EVxtT3d8/vLpCdMwgeBEEQDIIgCAYPgkHw4MO/ljGOSUwjJUpZIsvFO7+hTJxkAxPn3LXGvHQW88kPmH+VgooggwpaGGGMRXOGnS4Su67w0YJ/fzRQd2OC8tm1MsoEkkiOZNd6SPVgnoqeseWJsIpkqf0huUPK41RJ99Ii4x+kSTt0iqGsGLBL5xTyf8CTDDtFNjMqJ9TLFNM9MLUzzrLKGuvsWz9/iUNSHx+w8tEAe06d3qvhXOHy6m1x2HfL0DfPmYGlFX9tkrDua/JFY5DL3f+ehmqPKqPkyHuWkPH+v+Un8Jf/FYnYDRljZ5kKfVFsSa1Sp12MVjKts4MtO1Hn/nCMe+fHxyUbMHNFYDcPLrrEvu1jk+oH4+MWMveQU+qnZI8w3JI4FkPvU5PGtKY3I3CpSYRv3cTg+omkruRyArBM1F4gKIXzpQHV3GP+8xWTIxuB2QR61pPUKmgjCJZoHWgjqdMSzVFBA6CNgkNWaP+Qt7JWGgdlO/zeaIJhml37ZW4kDbRAmq3osI7h7sW1AUIhIAUhgI1FmAUDrQKu+Di7gNgi9QVO++OJBxawh5AIaYgEqRjzSd4VF2u1NWOIV67JxKD0y1xk33cLsHVE/CAc9GgdbcsQlawgdhCOgkev57qIDCSN7BX01mIRBmtvMaS0iv5FFDhBpQ+Ckri6GgC0BLAGNHocYSpXV/8a+XmEYmoOHxAHjTqhDwsLgFsiWFgiLCJFUiIsIlciLCJIIiwiRiJdAw==',
  'base64'
));
/**
 * @type {Record<string, number>}
 */
export const classes = Object.fromEntries(
  EastAsianWidth.values.map((v, i) => [v, i])
);
export const values = EastAsianWidth.values;
