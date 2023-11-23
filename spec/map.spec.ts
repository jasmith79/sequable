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

  it("should respect the return method of iterators", () => {
    const f = function* () {
      let n = 2;
      while (n--) {
        yield n;
      }
    };

    const iter = map((n: number) => n + 1, f)[Symbol.iterator]();
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
    expect(result).toEqual([2]);
  });

  it("should respect the throw method of iterators", () => {
    const f = function* () {
      let n = 2;
      while (n--) {
        yield n;
      }
    };

    const iter = map((n: number) => n + 1, f)[Symbol.iterator]();
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

    expect(result).toEqual([2]);
    expect(passed).toBe(true);
  });
});
