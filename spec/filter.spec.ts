import { filter } from "../src";
import { describe, it, expect } from "vitest";

const isOdd = (n: number): boolean => Boolean(n % 2);
const isEven = (n: number) => !isOdd(n);

describe("filter", () => {
  it("should return the items from a sequence that match a predicate", () => {
    expect(Array.from(filter(Boolean, [0, 1, 2]))).toEqual([1, 2]);
  });

  it("supports the return value semantic of generator functions", () => {
    const f = function* () {
      let n = 3;
      while (n--) {
        yield n;
      }

      return 7;
    };

    const iter = filter(isOdd, f)[Symbol.iterator]();
    let { done, value } = iter.next();
    while (!done) ({ done, value } = iter.next());
    expect(value).toBe(7);

    const g = function* () {
      let n = 3;
      while (n--) {
        yield n;
      }

      return 7;
    };

    const evenIter = filter(isEven, g)[Symbol.iterator]();
    ({ done, value } = evenIter.next());
    while (!done) ({ done, value } = evenIter.next());
    expect(value).toBeUndefined();
  });
});
