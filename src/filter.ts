import { Sequable, toIterator } from "./sequable";

/**
 * Filters the items of the given Iterator, Iterable, or generator function
 * using the supplied predicate function.
 *
 * @param pred The predicate function.
 * @param sequable The Iterator, Iterable, or generator function sequence
 * to filter.
 */
export function* filter<F extends (arg: any) => boolean>(
  pred: F,
  seq: Sequable<Parameters<F>[0]>,
): Iterable<Parameters<F>[0]> {
  const iter = toIterator(seq);
  let { value, done } = iter.next();
  while (!done) {
    if (pred(value)) {
      yield value;
    }
    ({ value, done } = iter.next());
  }

  if (value !== undefined && pred(value)) return value;
}
