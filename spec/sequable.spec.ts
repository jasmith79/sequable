import { toIterator } from "../src";

describe("toIterator", () => {
  it("should return an iterator from an iterable", () => {
    expect(toIterator([1, 2]).next()).toEqual({ value: 1, done: false });
  });

  it("should return an iterator from a generator", () => {
    function* test() {
      yield 1;
    }
    expect(toIterator(test).next()).toEqual({ value: 1, done: false });
  });

  it("should return an iterator given an iterator", () => {
    const iter = [1, 2][Symbol.iterator]();
    expect(toIterator(iter)).toBe(iter);
  });
});
