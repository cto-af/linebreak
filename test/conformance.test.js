import { assertBreaks } from "./utils.js";

describe("conformance tests use example 7", () => {
  const opts = {
    string: true,
    example7: true,
  };

  it("has a new LB13", () => {
    assertBreaks("9}", [2], opts); // NU CL
    assertBreaks("a}", [2], opts); // AL CL
    assertBreaks("9)", [2], opts); // NU CP
    assertBreaks("a)", [2], opts); // AL CP
    assertBreaks("9!", [2], opts); // NU EX
    assertBreaks("a!", [2], opts); // AL EX
    assertBreaks("9,", [2], opts); // NU IS
    assertBreaks("a,", [2], opts); // AL IS
    assertBreaks("9/", [2], opts); // NU SY
    assertBreaks("a/", [2], opts); // AL SY
  });

  it("has a new LB25", () => {
    assertBreaks("$9", [2], opts);
    assertBreaks("%9", [2], opts);
    assertBreaks("$(9", [3], opts);
    assertBreaks("$-9", [3], opts);
    assertBreaks("$-a", [2, 3], opts);
    assertBreaks("$\x01", [2], opts);
    assertBreaks("9999999\xb4", [7, 8], opts);
    assertBreaks("9)\xb4", [2, 3], opts);
    assertBreaks("9%\xb4", [2, 3], opts);
    assertBreaks("9\xb4", [1, 2], opts);
    assertBreaks("9)%\xb4", [3, 4], opts);
    assertBreaks("(9\xb4", [2, 3], opts);
    assertBreaks("aa", [2], opts);
  });
});
