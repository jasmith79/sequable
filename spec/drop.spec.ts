import { drop, dropWhile } from "../src";
import { describe, it, expect } from "vitest";

describe("drop", () => {
  it("should drop the first n items from the given iterable", () => {
    expect([...drop(1, [1, 2])]).toEqual([2]);
    expect([...drop(1, [])]).toEqual([]);
    expect([...drop(1, [1])]).toEqual([]);
  });

  it("supports the return value semantic of generator functions", () => {
    const f = function* () {
      let n = 3;
      while (n--) {
        yield n;
      }

      return 7;
    };

    const iter = drop(2, f)[Symbol.iterator]();
    let { done, value } = iter.next();
    while (!done) ({ done, value } = iter.next());
    expect(value).toBe(7);
  });
});

describe("dropWhile", () => {
  it("should drop items until the supplied predicate returns false", () => {
    expect([...dropWhile((x) => Boolean(x % 2), [1, 3, 5, 8, 10, 11])]).toEqual(
      [8, 10, 11],
    );
    expect([...dropWhile((x) => Boolean(x % 2), [1, 3, 5])]).toEqual([]);
    expect([...dropWhile((x) => Boolean(x % 2), [])]).toEqual([]);
  });

  it("supports the return value semantic of generator functions", () => {
    const f = function* () {
      let n = 3;
      while (n--) {
        yield n;
      }

      return 7;
    };

    const iter = dropWhile((n: number) => n === 2, f)[Symbol.iterator]();
    let { done, value } = iter.next();
    while (!done) ({ done, value } = iter.next());
    expect(value).toBe(7);
  });
});
