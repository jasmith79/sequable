import { zip } from "../src";
import { describe, it, expect } from "vitest";

describe("zip", () => {
  it("should combine two sequences", () => {
    expect(Array.from(zip(["a", "b", "c"], [1, 2, 3]))).toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
  });

  it("should truncate the length to the shorter of the two", () => {
    expect(Array.from(zip(["a", "b", "c"], [1, 2, 3, 4]))).toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);

    expect(Array.from(zip(["a", "b", "c", "d"], [1, 2, 3]))).toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
  });
});
