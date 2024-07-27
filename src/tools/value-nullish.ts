import type { Nullish, TypeCheckFunction } from '../private-types';

type IsValidResult<V> = [isValid: true, validValue: V];
type IsNullishResult = [isValid: false, value: Nullish];

export function resolveValue<V>(value: unknown, isValidValue: TypeCheckFunction<V>): IsValidResult<V> | IsNullishResult | undefined {

  // return "success" result if value is valid
  if (isValidValue(value)) return [true, value];

  // return "nullish" result if value is nullish
  if (value == null) return [false, value];

  // return nothing if value is invalid

}
