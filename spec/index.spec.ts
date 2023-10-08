import { filter, map, take } from "../src";

const square = (n: number): number => n * n;
const isOdd = (n: number): boolean => n % 2 !== 0;
const inf = function* () {
  let i = 0;
  while (true) {
    yield ++i; // all positive integers
  }
};

const toArr = <T>(iter: Iterable<T>): T[] => Array.from(iter);

// I don't have the patience to type variadic compose properly.
// Especially not just for a test.
const compose =
  <G extends (x: any) => any, F extends (x: ReturnType<G>) => any>(
    f: F,
    g: G,
  ) =>
  (x: Parameters<G>[0]) =>
    f(g(x));

describe("generator functions", () => {
  it("should compose the expected way", () => {
    const take3 = take.bind(null, 3);
    const filterOdd = filter.bind(null, isOdd);
    const squareNum = map.bind(null, square);
    const filterAndSquare = compose(squareNum, filterOdd);
    const arrayOf3 = compose(toArr, take3);
    const pipeline = compose(arrayOf3, filterAndSquare);
    expect(pipeline(inf)).toEqual([1, 9, 25]);
  });
});
