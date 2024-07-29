import type { Nullish, TypeCheckFunction } from '../private-types';

type ValueOrNullishResult<V, T> = [isValid: V, value: T];
type IsValidResult<V> = ValueOrNullishResult<true, V>;
type IsNullishResult = ValueOrNullishResult<false, Nullish>;

export function resolveValueOrNullish<V>(value: unknown, isValidValue: TypeCheckFunction<V>): IsValidResult<V> | IsNullishResult | undefined {

  // return "success" result if value is valid
  if (isValidValue(value)) return [true, value];

  // return "nullish" result if value is nullish
  if (value == null) return [false, value];

  // return nothing if value is invalid

}
