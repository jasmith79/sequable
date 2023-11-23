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

  it("should respect the return method of iterators", () => {
    const f = function* () {
      let n = 2;
      while (n--) {
        yield n;
      }
    };

    const g = function* () {
      let n = 4;
      while (n--) {
        yield n;
      }
    };

    const iter = zip(f, g)[Symbol.iterator]();
    expect(iter.return).toBeDefined();
    const result: number[][] = [];
    let { done, value }: IteratorResult<number[]> = iter.next();
    while (!done) {
      result.push(value);
      if (result.length === 1) {
        const res = iter.return?.(9);
        if (res) {
          ({ done, value } = res);
        }
      } else {
        ({ done, value } = iter.next());
      }
    }

    expect(value).toBe(9);
    expect(result).toEqual([[1, 3]]);
  });

  it("should respect the throw method of iterators", () => {
    const f = function* () {
      let n = 2;
      while (n--) {
        yield n;
      }
    };

    const g = function* () {
      let n = 4;
      while (n--) {
        yield n;
      }
    };

    const iter = zip(f, g)[Symbol.iterator]();
    expect(iter.throw).toBeDefined();
    const result: number[][] = [];
    let { done, value }: IteratorResult<number[]> = iter.next();

    let passed = false;
    while (!done) {
      result.push(value);
      if (result.length === 1) {
        try {
          iter.throw?.(new Error("stopping"));
        } catch (_err) {
          passed = true;
        }
        break;
      }
      ({ done, value } = iter.next());
    }

    expect(result).toEqual([[1, 3]]);
    expect(passed).toBe(true);
  });
});
