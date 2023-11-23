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

  it("should respect the return method of iterators", () => {
    const f = function* () {
      let n = 2;
      while (n--) {
        yield n;
      }
    };

    const iter = drop(1, f)[Symbol.iterator]();
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
    expect(result).toEqual([0]);
  });

  it("should respect the throw method of iterators", () => {
    const f = function* () {
      let n = 2;
      while (n--) {
        yield n;
      }
    };

    const iter = drop(1, f)[Symbol.iterator]();
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

    expect(result).toEqual([0]);
    expect(passed).toBe(true);
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

  it("should respect the return method of iterators", () => {
    const f = function* () {
      let n = 2;
      while (n--) {
        yield n;
      }
    };

    const iter = dropWhile((n: number) => n === 2, f)[Symbol.iterator]();
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

    const iter = dropWhile((n: number) => n === 2, f)[Symbol.iterator]();
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
