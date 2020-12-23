import { createResult } from './create-result';
import type { PotentialResolver, TypeCheckFunction } from './types';

export function createValueResolver<K extends string, V>(
  keys: K[],
  isValidValue: TypeCheckFunction<V>,
): PotentialResolver<K, V> {
  return (value) => {
    if (isValidValue(value)) {
      return createResult(
        keys,
        value,
      );
    }
  };
}

/** @deprecated */
export function resolveValue<K extends string, V>(
  value: unknown,
  keys: K[],
  isValidValue: TypeCheckFunction<V>,
): Record<K, V> | void {
  return createValueResolver(
    keys,
    isValidValue,
  )(value);
}
