// Uniqe Symbol is a nice hack that disables to construct type with it when it is not exposed
declare const NumberRestriction: unique symbol;

export type NumberInRange<Min extends number, Max extends number> = number & {
  [NumberRestriction]: {
    min: Min,
    max: Max,
  }
}

export type Integer = number & {
  [NumberRestriction]: {
    integer: true,
    isFinite: true
  }
}

export type FiniteNumber = number & {
  [NumberRestriction]: {
    isFinite: true
  }
}

export type PositiveNumber = number & {
  [NumberRestriction]: {
    positive: true
  }
}

export type NonZeroNumber = number & {
  [NumberRestriction]: {
    isZero: false
  };
}

type NumberRestrictor
  = ReturnType<typeof numberInRange>
  | typeof integer
  | typeof nonZero
  | typeof positiveNumber;

export class NumberError extends TypeError {}
export class IntegerError extends NumberError {}
export class NumberRangeError extends NumberError {}
export class NegativeNumberError extends NumberError {}
export class ZeroError extends NumberError {}
export class NotFiniteNumberError extends NumberError {}

export const numberInRange = <Min extends number, Max extends number>(min: Min, max: Max) =>
  <Input extends number>(value: Input) => {
    if (value < min || value > max) {
      throw new NumberRangeError(`Expected number in range: ${min} <= x <= ${max}. Got ${value}.`);
    }

    return value as (Input & NumberInRange<Min, Max>);
  };

export const integer = <Input extends number>(value: Input) => {
  finiteNumber(value);

  if (Math.floor(value) !== value) {
    throw new IntegerError('Expected integer, got float');
  }

  return value as (Input & Integer);
};

export const positiveNumber = <Input extends number>(value: Input) => {
  if (value < 0) {
    throw new NegativeNumberError('Expected positive number, got negative.')
  }

  return value as (Input & PositiveNumber)
};

export const nonZero = <Input extends number>(value: Input) => {
  if (value === 0) {
    throw new ZeroError('Expected non-zero number, got zero.');
  }

  return value as (Input & NonZeroNumber);
};

export const naturalNumber = <Input extends number>(value: Input) => integer(positiveNumber(value));

export const finiteNumber = <Input extends number>(value: Input) => {
  if (!isFinite(value)) {
    throw new NotFiniteNumberError('Expected integer');
  }

  return value as (Input & FiniteNumber);
};


export function compose<T extends NumberRestrictor>(fn: T): T;
export function compose<A extends NumberRestrictor, B extends NumberRestrictor>(a: A, b: B): (value: number) => ReturnType<A> & ReturnType<B> ;
export function compose<A extends NumberRestrictor, B extends NumberRestrictor, C extends NumberRestrictor>(a: A, b: B, c: C): (value: number) => ReturnType<A> & ReturnType<B> & ReturnType<C>;
export function compose<A extends NumberRestrictor, B extends NumberRestrictor, C extends NumberRestrictor, D extends NumberRestrictor>(a: A, b: B, c: C, d: D): ReturnType<A> & ReturnType<B> & ReturnType<C> & ReturnType<D>;
export function compose (...restrictors: any[]) {
  return (value: any) => {
    restrictors.forEach(
      restrictor => restrictor(value)
    );

    return value;
  };
}

export const safeDiv = (a: FiniteNumber, b: FiniteNumber & NonZeroNumber) => (a / b) as FiniteNumber;

