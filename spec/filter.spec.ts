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

  it("should respect the return method of iterators", () => {
    const f = function* () {
      let n = 2;
      while (n--) {
        yield n;
      }
    };

    const iter = filter((n: number) => n !== 2, f)[Symbol.iterator]();
    expect(iter.return).toBeDefined();
    const result: number[] = [];
    let { done, value }: IteratorResult<number> = iter.next();
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
    expect(result).toEqual([1]);
  });

  it("should respect the throw method of iterators", () => {
    const f = function* () {
      let n = 2;
      while (n--) {
        yield n;
      }
    };

    const iter = filter((n: number) => n !== 2, f)[Symbol.iterator]();
    expect(iter.throw).toBeDefined();
    const result: number[] = [];
    let { done, value }: IteratorResult<number | undefined> = {
      done: false,
      value: undefined,
    };

    let passed = false;
    while (!done) {
      ({ done, value } = iter.next());
      result.push(value);
      if (result.length === 1) {
        try {
          iter.throw?.(new Error("stopping"));
        } catch (_err) {
          passed = true;
        }
        break;
      }
    }

    expect(result).toEqual([1]);
    expect(passed).toBe(true);
  });
});
