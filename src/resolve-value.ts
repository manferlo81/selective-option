import { keysToObject } from './extend';
import { SelectiveResolved, TypeCheckFunction } from './types';

export function resolveValue<K extends string, V>(
  value: unknown,
  keys: K[],
  isValidValue: TypeCheckFunction<V>,
): SelectiveResolved<K, V> | void {
  if (isValidValue(value)) {
    return keysToObject(
      keys,
      value,
    );
  }
}
