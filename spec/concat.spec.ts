import { concat } from "../src";

describe("concat", () => {
  it("should concatenate sequences", () => {
    expect([...concat(["a"], "bcd")]).toEqual(["a", "b", "c", "d"]);
  });
});
