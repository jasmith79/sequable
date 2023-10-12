import { Sequable, toIterator } from "./sequable.js";

/**
 * Yields tuples of the results of the two given Iterables, Iterators, or
 * generator functions.
 *
 * @param a The first sequence to combine.
 * @param b The second sequence to combine.
 */
export function* zip<T, U>(a: Sequable<T>, b: Sequable<U>): Iterable<[T, U]> {
  const xs = toIterator(a);
  const ys = toIterator(b);

  let x = xs.next();
  let y = ys.next();

  while (!x.done && !y.done) {
    yield [x.value, y.value];
    x = xs.next();
    y = ys.next();
  }

  if (x.value !== undefined && y.value !== undefined) return [x.value, y.value];
}
