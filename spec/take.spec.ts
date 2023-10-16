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
    const inf = function*() {
      let i = 0;
      while (true) {
        yield ++i; // all positive integers
      }
    };

    expect(Array.from(take(3, inf))).toEqual([1, 2, 3]);
  });
});

describe("takeWhile", () => {
  it("should return a sequence up until an item fails the predicate", () => {
    expect(Array.from(takeWhile(Boolean, [1, 2, 0]))).toEqual([1, 2]);
    expect(Array.from(takeWhile(Boolean, [1, 2]))).toEqual([1, 2]);
  });
});
