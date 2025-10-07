import type { Nullish, TypeCheckFunction } from '../types/private-types'
import { errorInvalidValue } from './errors'

type ValueOrNullishResult<V extends boolean, T> = [isValid: V, value: T]
type IsValidResult<V> = ValueOrNullishResult<true, V>
type IsNullishResult = ValueOrNullishResult<false, Nullish>

export function validateValue<V>(value: unknown, isValidValue: TypeCheckFunction<V>): IsValidResult<V> | IsNullishResult | ReturnType<() => void> {

  // return "valid" result if value is valid
  if (isValidValue(value)) return [true, value]

  // return "nullish" result if value is nullish
  if (value == null) return [false, value]

  // return nothing (undefined) if value is invalid
  // return;

}

export function validateValueOrThrow<V>(value: unknown, isValidValue: TypeCheckFunction<V>): IsValidResult<V> | IsNullishResult {

  // resolve if value is valid or nullish
  const resolved = validateValue(value, isValidValue)

  // throw if not resolved
  if (!resolved) throw errorInvalidValue(value)

  // return resolved value
  return resolved

}
