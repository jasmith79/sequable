import { Sequable, toIterator } from "./sequable.js";

/**
 * Drops the first n items of the given Iterator, Iterable, or generator
 * function.
 *
 * @param n The number of items to drop.
 * @param sequable The Iterator, Iterable, or generator function sequence
 * to yield from.
 */
export function* drop<T>(n: number, sequable: Sequable<T>): Iterable<T> {
  const iter = toIterator(sequable);
  let { value, done } = iter.next();
  while (!done && n--) {
    ({ value, done } = iter.next());
  }

  while (!done) {
    yield value;
    ({ value, done } = iter.next());
  }

  if (value !== undefined) return value;
}

/**
 * Drops the items of the given Iterator, Iterable, or generator function
 * until one item fails the supplied predicate function.
 *
 * @param pred The predicate function.
 * @param sequable The Iterator, Iterable, or generator function sequence
 * to drop from.
 */
export function* dropWhile<F extends (x: any) => boolean>(
  pred: F,
  sequable: Sequable<Parameters<F>[0]>,
): Iterable<Parameters<F>[0]> {
  const iter = toIterator(sequable);
  let { value, done } = iter.next();
  while (!done && pred(value)) {
    ({ value, done } = iter.next());
  }

  while (!done) {
    yield value;
    ({ value, done } = iter.next());
  }

  if (value !== undefined) return value;
}
