import { Sequable, toIterable } from "./sequable.js";

export function concat<T, U = T>(
  a: Sequable<T>,
  b: Sequable<U>,
): Iterable<T | U> {
  const as = toIterable(a);
  const bs = toIterable(b);
  return {
    *[Symbol.iterator]() {
      yield* as;
      yield* bs;
    },
  };
}
