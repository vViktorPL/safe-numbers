# safe-numbers

This is an experimental project to test to which extent TypeScript static typing can be used to
help with number values. It tries to make use of ideas like nominal or opaque types to
hint the type system about possible values and make them fit only 
(if you exclude unsafe TS features like "any" type or type casting) 
when some runtime validation code exists before code that uses such value with narrowed type.

## Examples

### Restricting number to range

```typescript
import { NumberInRange, numberInRange } from 'safe-numbers';

type Rating = NumberInRange<1, 5>;
const ratingFromNumber = numberInRange(1, 5);
const monthFromNumber = numberInRange(1, 12);

function vote(rating: Rating) {
  // here, rating is guaranteed to be number between 1 and 5 
  // of course if type "any" was not used to hack the type system
}

vote(10); // Compiler error
vote(monthFromNumber(12)); // Compiler error, because monthFromNumber return type guarantees number between 1 and 12, not 1 and 5
vote(ratingFromNumber(10)); // Compiles, but runtime error is thrown before "vote" function is called
vote(ratingFromNumber(5)); // OK
```

### Restricting number be an integer in range

When you want more than one restriction, you can use `compose` function to mix them:

```typescript
import { NumberInRange, Integer, numberInRange, integer, compose } from 'safe-numbers';

type Rating = Integer & NumberInRange<1, 5>;
const ratingFromNumber = compose(integer, numberInRange(1,5));

function vote(rating: Rating) {
  // number is guaranteed to be 1, 2, 3, 4 or 5
}

vote(10); // Compiler error
vote(ratingFromNumber(3.5)); // Compiles, but runtime error is thrown before "vote" function is called
vote(ratingFromNumber(5)); // OK
```

## Why?
For fun. Perhaps writing code in such manner would be cumbersome in production, although some experiments can 
sometimes turn into something practical. Also, this can be a working example of Nominal Types application.

## Ideas to be explored

### TypeScript plugin

Perhaps some code transforming plugin that can be used together with TTypeScript, would
help with some additional checks like:

* Checking hardcoded constants if they match a number type for instance `numberInRange(1,5)(6)` would throw compiler error
* Concluding that `Range<1, 5>` is assignable to `Range<1, 10>` as they overlap
* Defending against `any` type and unsafe type-casting in specific parts of the code (exclusively). Such plugin could be useful in broader scope, not only number types.
