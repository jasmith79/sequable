import { describe, it, expect } from "vitest";
import { concat } from "../src";

describe("concat", () => {
  it("should concatenate sequences", () => {
    expect([...concat(["a"], "bcd")]).toEqual(["a", "b", "c", "d"]);
  });

  it("should respect the return method of iterators", () => {
    const f = function* () {
      let n = 2;
      while (n--) {
        yield n;
      }
    };

    const g = function* () {
      let n = 0;
      while (n < 3) {
        yield n++;
      }
    };

    const iter = concat(f, g)[Symbol.iterator]();
    expect(iter.return).toBeDefined();
    const result: number[] = [];
    let { done, value }: IteratorResult<number> = iter.next();
    while (!done) {
      result.push(value);
      if (result.length === 2) {
        const res = iter.return?.(9);
        if (res) {
          ({ done, value } = res);
        }
      } else {
        ({ done, value } = iter.next());
      }
    }

    expect(value).toBe(9);
    expect(result).toEqual([1, 0]);
  });

  it("should respect the throw method of iterators", () => {
    const f = function* () {
      let n = 2;
      while (n--) {
        yield n;
      }
    };

    const g = function* () {
      let n = 0;
      while (n < 3) {
        yield n++;
      }
    };

    const iter = concat(f, g)[Symbol.iterator]();
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
      if (result.length === 2) {
        try {
          iter.throw?.(new Error("stopping"));
        } catch (_err) {
          passed = true;
        }
        break;
      }
    }

    expect(result).toEqual([1, 0]);
    expect(passed).toBe(true);
  });
});
