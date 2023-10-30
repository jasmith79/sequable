import { map } from "../src";
import { describe, it, expect } from "vitest";

const square = (n: number): number => n * n;

describe("map", () => {
  it("should tranform a sequence", () => {
    expect(Array.from(map(square, [1, 2, 3]))).toEqual([1, 4, 9]);
    expect(Array.from(map(String, [1, 2, 3]))).toEqual(["1", "2", "3"]);
  });

  it("supports the return value semantic of generator functions", () => {
    const f = function* () {
      let n = 3;
      while (n--) {
        yield n;
      }

      return 7;
    };

    const iter = map((n: number) => n + 1, f)[Symbol.iterator]();
    let { done, value } = iter.next();
    while (!done) ({ done, value } = iter.next());
    expect(value).toBe(8);
  });
});
