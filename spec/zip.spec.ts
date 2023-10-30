import { zip } from "../src";
import { describe, it, expect } from "vitest";

describe("zip", () => {
  it("should combine two sequences", () => {
    expect(Array.from(zip(["a", "b", "c"], [1, 2, 3]))).toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
  });

  it("should truncate the length to the shorter of the two", () => {
    expect(Array.from(zip(["a", "b", "c"], [1, 2, 3, 4]))).toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);

    expect(Array.from(zip(["a", "b", "c", "d"], [1, 2, 3]))).toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
  });

  it("supports the return value semantic of generator functions", () => {
    const f = function* () {
      let n = 3;
      while (n--) {
        yield n;
      }

      return 7;
    };

    const g = function* () {
      let n = 4;
      while (n--) {
        yield n;
      }
    };

    const iter = zip(f, g)[Symbol.iterator]();
    let { done, value } = iter.next();
    while (!done) ({ done, value } = iter.next());
    expect(value).toEqual([7, 0]);
  });
});
