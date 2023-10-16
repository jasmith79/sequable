import { toIterable, toIterator } from "../src";
import { describe, it, expect } from "vitest";

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

describe("toIterable", () => {
  function* foo() {
    yield 1;
  }
  it("should return an iterable from a generator", () => {
    expect([...toIterable(foo)]).toEqual([1]);
  });

  it("should return an iterable from a iterator", () => {
    expect([...toIterable(foo())]).toEqual([1]);
  });

  it("should return an iterable given an iterable", () => {
    expect(toIterable([1, 2])).toEqual([1, 2]);
  });
});
