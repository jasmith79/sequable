import { take, takeWhile } from "../src";
import { describe, it, expect } from "vitest";

describe("take", () => {
  it("should yield n items from a Iterable data type", () => {
    expect(Array.from(take(3, "foobar"))).toEqual(["f", "o", "o"]);
  });

  it("should yield back the input as sequence", () => {
    expect(Array.from(take(3, [1, 2, 3]))).toEqual([1, 2, 3]);
  });

  it("should work with infinite sequences", () => {
    const inf = function* () {
      let i = 0;
      while (true) {
        yield ++i; // all positive integers
      }
    };

    expect(Array.from(take(3, inf))).toEqual([1, 2, 3]);
  });

  it("should respect the return method of iterators", () => {
    const f = function* () {
      let n = 2;
      while (n--) {
        yield n;
      }
    };

    const iter = take(1, f)[Symbol.iterator]();
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

    const iter = take(1, f)[Symbol.iterator]();
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

describe("takeWhile", () => {
  it("should return a sequence up until an item fails the predicate", () => {
    expect(Array.from(takeWhile(Boolean, [1, 2, 0]))).toEqual([1, 2]);
    expect(Array.from(takeWhile(Boolean, [1, 2]))).toEqual([1, 2]);
  });

  it("supports the return value semantic of generator functions", () => {
    const f = function* () {
      let n = 3;
      while (n--) {
        yield n;
      }

      return 7;
    };

    let value: number[] = [];
    let done: boolean | undefined = false;
    const parted = takeWhile((_n: number) => true, f);
    const iter = parted[Symbol.iterator]();
    while (!done) {
      ({ value, done } = iter.next());
    }
    expect(value).toEqual(7);
  });

  it("should respect the return method of iterators", () => {
    const f = function* () {
      let n = 2;
      while (n--) {
        yield n;
      }
    };

    const iter = takeWhile(Boolean, f)[Symbol.iterator]();
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

    const iter = takeWhile(Boolean, f)[Symbol.iterator]();
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
