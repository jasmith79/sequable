import { map } from "../src";

const square = (n: number): number => n * n;

describe("map", () => {
  it("should tranform a sequence", () => {
    expect(Array.from(map(square, [1, 2, 3]))).toEqual([1, 4, 9]);
    expect(Array.from(map(String, [1, 2, 3]))).toEqual(["1", "2", "3"]);
  });
});
