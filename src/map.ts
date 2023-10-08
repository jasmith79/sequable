/* eslint-disable @typescript-eslint/no-explicit-any */
import { Sequable, toIterator } from "./sequable";

/**
 * Maps the given function over the given Iterator, Iterable, or generator
 * function.
 *
 * @param f The transformation function.
 * @param sequable The Iterator, Iterable, or generator function sequence
 * to tranform.
 */
export function* map<F extends (arg: any) => any>(
  f: F,
  sequable: Sequable<Parameters<F>[0]>,
): Iterable<ReturnType<F>> {
  const iter = toIterator(sequable);
  let { value, done } = iter.next();
  while (!done) {
    yield f(value);
    ({ value, done } = iter.next());
  }
  if (value !== undefined) return f(value);
}
