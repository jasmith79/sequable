import { drop, dropWhile } from "../src";

describe("drop", () => {
  it("should drop the first n items from the given iterable", () => {
    expect([...drop(1, [1, 2])]).toEqual([2]);
    expect([...drop(1, [])]).toEqual([]);
    expect([...drop(1, [1])]).toEqual([]);
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
});
