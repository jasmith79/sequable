import { Sequable, toIterable } from "./sequable.js";

/**
 * Yields all of the items from sequence a then all of the items of sequence
 * b. NOTE: return values of the sub-iterators are ignored: only yielded
 * values are propagated similar to e.g. for..of loops.
 *
 * @param a The first sequence to combine.
 * @param b The second sequence to combine.
 */
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
