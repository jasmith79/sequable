import { partition, partitionBy } from "../src";
import { describe, it, expect } from "vitest";

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

    const isOdd = (n: number): boolean => Boolean(n % 2);
    const [odds] = partitionBy(isOdd, f)[Symbol.iterator]();
    let value = 0;
    let done: boolean | undefined = false;
    const iter = odds[Symbol.iterator]();
    while (!done) {
      ({ value, done } = iter.next());
    }
    expect(value).toBe(7);
  });
});
