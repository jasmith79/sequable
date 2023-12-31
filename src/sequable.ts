export type Sequable<T> = Iterator<T> | Iterable<T> | (() => Iterator<T>);

function isIterable<T>(x: unknown): x is Iterable<T> {
  return Boolean(
    x && typeof x[Symbol.iterator as keyof typeof x] === "function",
  );
}

/**
 * Converts the given Iterable or generator function to an Iterator, given
 * an Iterator just returns it.
 *
 * @param iter The Iterable, Iterator, or generator function to convert.
 */
export function toIterator<T>(iter: Sequable<T>): Iterator<T> {
  if (isIterable(iter)) {
    return iter[Symbol.iterator]();
  } else if (typeof iter === "function") {
    return iter();
  } else {
    return iter;
  }
}

/**
 * Converts the given Iterator or generator function to an Iterable, given
 * an Iterable just returns it.
 *
 * @param iter The Iterable, Iterator, or generator function to convert.
 */
export function toIterable<T>(iter: Sequable<T>): Iterable<T> {
  if (isIterable(iter)) {
    return iter;
  } else if (typeof iter === "function") {
    return {
      [Symbol.iterator]: iter,
    };
  } else {
    return {
      [Symbol.iterator]: () => iter,
    };
  }
}
