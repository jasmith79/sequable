import { partition, partitionBy } from "../src";
import { describe, it, expect } from "vitest";

const isOdd = (n: number): boolean => Boolean(n % 2);

describe("partition", () => {
  it("should split the iterator into n-sized chunks", () => {
    expect(
      Array.from(partition(2, [1, 2, 3, 4])).map((x) => Array.from(x)),
    ).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it("should flush the last iterable even if the src is not evenly divisible by n", () => {
    expect(
      Array.from(partition(2, [1, 2, 3])).map((x) => Array.from(x)),
    ).toEqual([[1, 2], [3]]);
  });

  it("supports the return value semantic of generator functions", () => {
    const f = function* () {
      let n = 3;
      while (n--) {
        yield n;
      }

      return [7];
    };

    let value: number[] = [];
    let done: boolean | undefined = false;
    const parted = partition(2, f);
    const iter = parted[Symbol.iterator]();
    while (!done) {
      ({ value, done } = iter.next());
    }
    expect(value).toEqual([7]);
  });

  it("should respect the return method of iterators", () => {
    const f = function* () {
      let n = 4;
      while (n--) {
        yield n;
      }
    };

    const iter = partition(2, f)[Symbol.iterator]();
    expect(iter.return).toBeDefined();
    const result: number[][] = [];
    let { done, value }: IteratorResult<Iterable<number>> = iter.next();
    while (!done) {
      result.push(value);
      if (result.length === 1) {
        const res = iter.return?.([9]);
        if (res) {
          ({ done, value } = res);
        }
      } else {
        ({ done, value } = iter.next());
      }
    }

    expect(value).toEqual([9]);
    expect([...result[0]]).toEqual([3, 2]);
  });

  it("should respect the throw method of iterators", () => {
    const f = function* () {
      let n = 2;
      while (n--) {
        yield n;
      }
    };

    const iter = partition(2, f)[Symbol.iterator]();
    expect(iter.throw).toBeDefined();
    const result: number[][] = [];
    let { done, value }: IteratorResult<Iterable<number>> = iter.next();

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

    expect(result).toEqual([[1, 0]]);
    expect(passed).toBe(true);
  });
});

describe("partitionBy", () => {
  it("does two result iterables split by predicate", () => {
    const [pass, fail] = partitionBy(Boolean, [0, 0, 0, 0, 1, 1, 1, 1]);
    expect(Array.from(pass)).toEqual([1, 1, 1, 1]);
    expect(Array.from(fail)).toEqual([0, 0, 0, 0]);
    const [pass2, fail2] = partitionBy(Boolean, [0, 1, 0, 1, 0, 1, 0, 1]);
    expect(Array.from(pass2)).toEqual([1, 1, 1, 1]);
    expect(Array.from(fail2)).toEqual([0, 0, 0, 0]);
    const [pass3, fail3] = partitionBy(Boolean, [1, 1, 1, 0, 0, 0, 0, 1]);
    expect(Array.from(pass3)).toEqual([1, 1, 1, 1]);
    expect(Array.from(fail3)).toEqual([0, 0, 0, 0]);
  });

  it("supports the return value semantic of generator functions", () => {
    const f = function* () {
      let n = 3;
      while (n--) {
        yield n;
      }

      return 7;
    };

    const [odds] = partitionBy(isOdd, f)[Symbol.iterator]();
    let value = 0;
    let done: boolean | undefined = false;
    const iter = odds[Symbol.iterator]();
    while (!done) {
      ({ value, done } = iter.next());
    }
    expect(value).toBe(7);
  });

  it("should respect the return method of iterators", () => {
    const f = function* () {
      let n = 2;
      while (n--) {
        yield n;
      }
    };

    const [iterable] = partitionBy(isOdd, f)[Symbol.iterator]();
    const iter = iterable[Symbol.iterator]();
    expect(iter.return).toBeDefined();
    const result: number[][] = [];
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

    const [iterable] = partitionBy(isOdd, f)[Symbol.iterator]();
    const iter = iterable[Symbol.iterator]();
    expect(iter.throw).toBeDefined();
    const result: number[][] = [];
    let { done, value }: IteratorResult<number> = iter.next();

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

    expect(result).toEqual([1]);
    expect(passed).toBe(true);
  });
});
