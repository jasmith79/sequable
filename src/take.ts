import { Sequable, toIterator } from "./sequable";

/**
 * Yields the first n items of the given Iterator, Iterable, or generator
 * function.
 *
 * @param n The number of items to yield.
 * @param sequable The Iterator, Iterable, or generator function sequence
 * to yield from.
 */
export function* take<T>(n: number, sequable: Sequable<T>): Iterable<T> {
  const iter = toIterator(sequable);
  let { value, done } = iter.next();
  while (n-- && !done) {
    yield value;
    ({ value, done } = iter.next());
  }
}

/**
 * Yields the items of the given Iterator, Iterable, or generator function
 * until one item fails the supplied predicate function.
 *
 * @param pred The predicate function.
 * @param sequable The Iterator, Iterable, or generator function sequence
 * to yield from.
 */
export function* takeWhile<P extends (x: any) => boolean>(
  pred: P,
  sequable: Sequable<Parameters<P>[0]>,
): Iterable<Parameters<P>[0]> {
  const iter = toIterator(sequable);
  let { value, done } = iter.next();
  while (!done && pred(value)) {
    yield value;
    ({ value, done } = iter.next());
  }

  if (value !== undefined && pred(value)) return value;
}
