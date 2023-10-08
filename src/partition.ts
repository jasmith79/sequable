import { Sequable, toIterator } from "./sequable";

/**
 * Partitions the given Iterable, Iterator, or generator function into an
 * Iterable of Iterables of size n.
 *
 * @param n The size of the sub-sequences. **NOTE**: must be finite! This
 * function maintains an internal buffer of the intermediate results to
 * force consumption of the supplied iterator. The supplied iterator can
 * be infinite, but n must be a finite integer number.
 * @param sequable The Iterable, Iterator, or generator function to chunk.
 */
export function* partition<T>(
  n: number,
  sequable: Sequable<T>,
): Iterable<Iterable<T>> {
  const iter = toIterator(sequable);
  // We can't just return take(n, sequable) over and over, we need to force
  // the consumption of the iterable otherwise iterating through the returned
  // iterables could have surprising results.
  let srcDone = false;
  while (!srcDone) {
    let i = n;
    const values = [];
    while (i--) {
      const { value, done } = iter.next();
      srcDone = Boolean(done);
      if (srcDone) {
        if (value !== undefined) values.push(value);
        break;
      } else {
        values.push(value);
      }
    }

    if (values.length) yield values;
  }
}

/**
 * Partitions the given Iterable, Iterator, or generator function into two
 * Iterables that pass and fail the given predicate, respectively.
 *
 * **NOTE:** this function maintains an internal cache of results for the
 * other Iterable when the first iterable is being consumed. When working with
 * infinite sequences if there is a long enough run of either passing or failing
 * while the other Iterable is being consumed it is possible to run out of
 * heap memory.
 *
 * For a concrete example, consider a sequence of integers partitioned by
 * isEven. The sequence has one odd integer followed by 1000 even
 * integers repeated endlessly. A consumer that tries to take a large number of
 * odd numbers will grow the cache of even numbers as the odd iterator is
 * consumed to the point where the allocation eventually fails.
 *
 * @param pred The predicate to split the sequence by.
 * @param sequable The Iterable, Iterator, or generator function to partition.
 */
export function partitionBy<P extends (x: unknown) => boolean>(
  pred: P,
  sequable: Sequable<Parameters<P>[0]>,
): [Iterable<Parameters<P>[0]>, Iterable<Parameters<P>[0]>] {
  const iter = toIterator(sequable);
  const lastPassingValues: Parameters<P>[0][] = [];
  const lastFailingValues: Parameters<P>[0][] = [];
  let srcDone = false;
  return [
    {
      *[Symbol.iterator]() {
        let { value, done } = iter.next();
        srcDone = Boolean(done);
        while (!srcDone) {
          if (pred(value)) {
            lastPassingValues.push(value);
            yield lastPassingValues.shift();
          } else {
            lastFailingValues.push(value);
          }
          ({ value, done } = iter.next());
          srcDone = Boolean(done);
        }

        while (lastPassingValues.length) {
          yield lastPassingValues.shift();
        }
      },
    },
    {
      *[Symbol.iterator]() {
        let { value, done } = iter.next();
        srcDone = Boolean(done);
        while (!srcDone) {
          if (pred(value)) {
            lastPassingValues.push(value);
          } else {
            lastFailingValues.push(value);
            yield lastFailingValues.shift();
          }
          ({ value, done } = iter.next());
          srcDone = Boolean(done);
        }

        while (lastFailingValues.length) {
          yield lastFailingValues.shift();
        }
      },
    },
  ];
}
