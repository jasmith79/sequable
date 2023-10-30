# Sequable

Library functions for working with generators.

## Usage

This library aims to be something like the array methods of lodash-fp but for working with generators and iterables. All of the functions in sequable will take a generator function, iterable object with a `[Symbol.iterator]` method, or iterator conforming to the `{ next: () => ({ value: T, done?: boolean }) }` interface. They should also all compose naturally with each other, for example:

```typescript
import { filter, map, take } from "@jasmith79/sequable";

const square = (n: number): number => n * n;
const isOdd = (n: number): boolean => n % 2 !== 0;

const take3 = take.bind(null, 3);
const filterOdd = filter.bind(null, isOdd);
const squareNum = map.bind(null, square);

// use your favorite library for function composition:
const getThreeOddSquares = compose(take3, squareNum, filterOdd);
console.log(...getThreeOddSquares([1, 2, 3, 4, 5, 6])); // 1 9 25
```

If you've ever worked with lodash-fp or ramda or this should be starting to seem familiar. And as you can see from example above the sequable functions return Iterables that can work with `Array.from`, the spread operator `...`, `for...of` loops, ...or be piped to other functions that handle Iterables.

Because they work with arbitrary iterables you can use any type that implements the iterator protocol: Sets, Arrays, Maps, etc. Even Strings:

```typescript
import { map, partition } from "@jasmith79/sequable";

const upperABCs = map(
  (x: string) => x.toUpperCase(),
  partition(3, "abcdefghikjlmnopqrstuvwxyz"),
);
for (let trio of upperABCs) {
  console.log(...trio); // prints A B C, then D E F, etc.
}
```

The idea here is to be able to write processing logic for sequential linear data that is _container agnostic_: the processing logic (especially at the type level in Typescript) should not be coupled to a specific concrete container type like an Array or Set (or FIFO Queue, or DFS over a tree, or...) unless it absolutely has to be. With sequable, anything that is or can be converted to an iterator will work. Additionally the fact that we're working with iterators means we can work with _infinite_ data sets and lazily consume them:

```typescript
const allPositiveIntegers = function* () {
  let i = 0;
  while (true) {
    yield ++i;
  }
};

console.log(...getThreeOddSquares(allPositiveIntegers)); // still just 1 9 25
```

Unlike the `Array.prototype` versions of `map`, `filter`, etc. which materialize a new Array at every step in the method chain composed sequable functions will pull each item all the way through the processing chain one at a time. We're still filtering out even numbers and then squaring but we only consume as many of the (infinity!) of positive integers as we need.

## Note about statefulness:

Iterators are inherently stateful. I've shown only pure function usage above for a _reason_. Just like you shouldn't mutate an array while iterating it with a `for` loop, you should be careful what side effects you introduce here too. Also walking through an iterator consumes it: don't hand the same iterator to multiple consumers:

```typescript
const iter = getThreeOddSquares(allPositiveIntegers)[Symbol.iterator]();
console.log(...iter); // logs 1, 9, 25
const foo = Array.from(iter); // foo is empty because iter is already exhausted!
```

Fortunately since the library returns iterables rather than raw iterators this can usually be avoided.

## Note about returned values:

It is possible when defining a generator function to return a value in addition to yielding values:

```
function* f() {
  let n = 2;
  while (n--) {
    yield n;
  }

  return 7;
}

const iter = f();
let result = {};
while (result.done) {
  result = iter.next();
  console.log(result);
}
```

will log out

```
{ done: false, value: 2 }
{ done: false, value: 1 }
{ done: false, value: 0 }
{ done: true, value: 7 }
```

HOWEVER, these returned values are mostly ignored by constructs in the language that process iterators/iterables:

```
const arr = Array.from(f()); // [2, 1, 0], no 7
for (const n of f()) {
  console.log(n); // logs 2, 1. 0 but not 7
}
```

With the exception of `concat` the functions in sequable largely pass these through with the expected semantics: `map` will return the value transformed by the function argument, `filter` will return the value if it passes the predicate, etc. But since `concat` combines sequables it's not clear to me at least at present what the semantics should be if one or both have return values so they are just dropped. See the unit tests for examples of how they are handled but if you never use the raw `.next()` method and instead use the usual constructs above you'll probably never even notice the return values.
