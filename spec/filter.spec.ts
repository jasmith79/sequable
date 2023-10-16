import { filter } from "../src";
import { describe, it, expect } from "vitest";

describe("filter", () => {
  it("should return the items from a sequence that match a predicate", () => {
    expect(Array.from(filter(Boolean, [0, 1, 2]))).toEqual([1, 2]);
  });
});
